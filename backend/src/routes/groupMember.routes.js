import { Router } from "express";
import { removeGroupMember } from "../controllers/groupMember.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.delete("/:groupId/:memberId", verifyJWT, removeGroupMember);

export default router;
