import express from "express";
import { inviteMemberByUsername, acceptInvitation } from "../controllers/invitation.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/invite", verifyJWT, inviteMemberByUsername);
router.get(
    "/accept/:token",
    (req, res, next) => {
        console.log("🔥 ACCEPT ROUTE HIT");
        next();
    },
    verifyJWT,
    acceptInvitation
);


export default router;
