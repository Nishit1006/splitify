import express from "express";
import { getGroupBalances } from "../controllers/balance.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/group/:groupId", getGroupBalances);

export default router;