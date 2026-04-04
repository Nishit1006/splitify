import { Router } from "express";
import { sendInvite, acceptInvite, rejectInvite } from "../controllers/invitation.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/send", sendInvite);
router.post("/accept/:inviteId", acceptInvite);
router.post("/reject/:inviteId", rejectInvite);

export default router;
