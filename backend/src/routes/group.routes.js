import { Router } from "express";
import {
    createGroup,
    deleteGroup,
    getMyGroups,
    getGroupMembers
} from "../controllers/group.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/", upload.single("groupImage"), createGroup);
router.get("/my", getMyGroups);
router.get("/:groupId/members", getGroupMembers);
router.delete("/:groupId", deleteGroup);

export default router;
