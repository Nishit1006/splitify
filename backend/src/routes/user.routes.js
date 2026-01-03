import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";

import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    verifyEmailOtp,
    forgotPassword,
    resetPassword
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

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
