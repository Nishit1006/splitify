import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },

        // 🔐 EMAIL VERIFICATION (OTP BASED)
        isVerified: {
            type: Boolean,
            default: false
        },
        emailOtp: {
            type: String
        },
        emailOtpExpiry: {
            type: Date
        },

        refreshToken: {
            type: String
        }
    },
    { timestamps: true }
);

// 🔒 hash password
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// check password
userSchema.methods.isPasswordCorrect = function (password) {
    return bcrypt.compare(password, this.password);
};

// generate access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d"
        }
    );
};

// generate refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d"
        }
    );
};

export const User = mongoose.model("User", userSchema);
