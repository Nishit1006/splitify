import express from "express";
import {
    createSettlement,
    getGroupSettlements,
    getMySettlements,
    deleteSettlement
} from "../controllers/settlement.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createSettlement);
router.get("/group/:groupId", getGroupSettlements);
router.get("/my", getMySettlements);
router.delete("/:settlementId", deleteSettlement);

export default router;
