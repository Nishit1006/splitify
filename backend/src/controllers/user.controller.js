import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import crypto from "crypto";
import { sendOtpEmail, sendResetPasswordEmail } from "../utils/email.js";
import { generateOtp } from "../utils/generateOtp.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new ApiError(404, "User not found");

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, error.message);
    }
};

export const registerUser = asyncHandler(async (req, res) => {
    let { fullName, email, username, password } = req.body;

    if ([fullName, email, username, password].some(v => !v?.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    email = email.toLowerCase().trim();
    username = username.toLowerCase().trim();

    const verifiedEmailExists = await User.findOne({ email, isVerified: true });
    if (verifiedEmailExists) {
        throw new ApiError(409, "Email already registered");
    }

    const verifiedUsernameExists = await User.findOne({ username, isVerified: true });
    if (verifiedUsernameExists) {
        throw new ApiError(409, "Username already taken");
    }

    await User.deleteMany({
        isVerified: false,
        emailOtpExpiry: { $lt: new Date() },
        $or: [{ email }, { username }]
    });

    const activePendingUser = await User.findOne({
        isVerified: false,
        emailOtpExpiry: { $gt: new Date() },
        $or: [{ email }, { username }]
    });

    if (activePendingUser) {
        throw new ApiError(409, "An unverified account with this email/username is currently pending. Please wait 10 minutes or use a different one.");
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await User.create({
        fullName,
        email,
        username,
        password,
        emailOtp: otp,
        emailOtpExpiry: otpExpiry,
    });

    try {
        await sendOtpEmail(email, otp);
    } catch (err) {
        console.error("OTP email failed:", err.message);
    }

    res.status(201).json(
        new ApiResponse(201, null, "OTP sent to email")
    );
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body || {};

    if (!(email || username) || !password) {
        throw new ApiError(400, "Email/Username and password are required");
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.isVerified) {
        throw new ApiError(401, "Please verify your email first");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const accessCookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    };

    const refreshCookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    };

    res.status(200)
        .cookie("accessToken", accessToken, accessCookieOptions)
        .cookie("refreshToken", refreshToken, refreshCookieOptions)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser },
                "User logged in successfully"
            )
        );
});

export const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $unset: { refreshToken: 1 }
    });

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    };

    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    const decoded = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded._id);
    if (!user || user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401, "Invalid refresh token");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const accessCookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    };

    const refreshCookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    };

    res.status(200)
        .cookie("accessToken", accessToken, accessCookieOptions)
        .cookie("refreshToken", refreshToken, refreshCookieOptions)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken },
                "Access token refreshed"
            )
        );
});

export const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body || {};

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Old and new passwords are required");
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.isPasswordCorrect(oldPassword);

    if (!isMatch) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    res.status(200).json(
        new ApiResponse(200, {}, "Password changed successfully")
    );
});

export const getCurrentUser = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, req.user, "User fetched successfully")
    );
});

export const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName } = req.body;

    if (!fullName) {
        throw new ApiError(400, "Full name is required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName
            }
        },
        { new: true }
    ).select("-password");

    return res.status(200).json(
        new ApiResponse(200, user, "Account details updated successfully")
    );
});

export const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    const user = await User.findOne({
        emailVerificationToken: token
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired token");
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json(
        new ApiResponse(200, null, "Email verified successfully")
    );
});

export const verifyEmailOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.isVerified) {
        throw new ApiError(400, "Email already verified");
    }

    if (
        user.emailOtp !== otp ||
        user.emailOtpExpiry < new Date()
    ) {
        throw new ApiError(400, "Invalid or expired OTP");
    }

    user.isVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpiry = undefined;

    await user.save();

    res.status(200).json(
        new ApiResponse(200, null, "Email verified successfully")
    );
});

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const resetToken = user.generateResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendResetPasswordEmail(user.email, resetLink);

    return res.status(200).json(
        new ApiResponse(200, null, "Reset password link sent to email")
    );
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
        throw new ApiError(400, "New password is required");
    }

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired token");
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    user.refreshToken = undefined;

    await user.save();

    return res.status(200).json(
        new ApiResponse(200, null, "Password reset successful")
    );
});