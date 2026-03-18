import { Router } from "express";
import { getGroupMembers, removeGroupMember, leaveGroup } from "../controllers/groupMember.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/:groupId", verifyJWT, getGroupMembers);
router.delete("/:groupId/:memberId", verifyJWT, removeGroupMember);
router.post("/:groupId/leave", verifyJWT, leaveGroup);

export default router;
