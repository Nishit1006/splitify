import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyEmailOtp } from "../controllers/user.controller.js";




import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails
} from "../controllers/user.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", verifyJWT, logoutUser);
router.get("/me", verifyJWT, getCurrentUser);
router.patch("/update", verifyJWT, updateAccountDetails);
router.patch("/change-password", verifyJWT, changeCurrentPassword);
router.post("/verify-email-otp", verifyEmailOtp);

export default router;
