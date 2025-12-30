import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import crypto from "crypto";
import { sendOtpEmail } from "../utils/email.js";
/* ================= TOKEN UTILS ================= */

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

/* ================= REGISTER ================= */
import { generateOtp } from "../utils/generateOtp.js";

export const registerUser = asyncHandler(async (req, res) => {
    let { fullName, email, username, password } = req.body;

    if ([fullName, email, username, password].some(v => !v?.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    email = email.toLowerCase().trim();
    username = username.toLowerCase().trim();

    const emailExists = await User.findOne({ email });
    if (emailExists) {
        throw new ApiError(409, "Email already exists");
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

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






/* ================= LOGIN ================= */

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

    const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken");

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    };

    res.status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser },
                "User logged in successfully"
            )
        );
});

/* ================= LOGOUT ================= */

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

/* ================= REFRESH TOKEN ================= */

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies?.refreshToken || req.body?.refreshToken;

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

    const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user._id);

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    };

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken },
                "Access token refreshed"
            )
        );
});

/* ================= CHANGE PASSWORD ================= */

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

/* ================= CURRENT USER ================= */

export const getCurrentUser = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, req.user, "User fetched successfully")
    );
});

/* ================= UPDATE PROFILE ================= */

export const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body || {};

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { fullName, email },
        { new: true }
    ).select("-password -refreshToken");

    res.status(200).json(
        new ApiResponse(200, user, "Account updated successfully")
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

