import express from "express";
import {
    getGroupBalances,
    getMyNetGroupBalance,
    getTotalUserNetBalance
} from "../controllers/balance.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/group/:groupId", getGroupBalances);
router.get("/group/:groupId/net", getMyNetGroupBalance);
router.get("/user/net", getTotalUserNetBalance);

export default router;
