import { Router } from "express";
import { createGroup } from "../controllers/group.controller.js";
import  verifyJWT from "../middlewares/auth.middleware.js";
import { getMyGroups } from "../controllers/group.controller.js";
const router = Router();

router.post("/", verifyJWT, createGroup);
router.get("/my", verifyJWT, getMyGroups);
export default router;


