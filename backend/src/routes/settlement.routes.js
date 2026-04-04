import { Router } from "express";
import {
    createSettlement,
    getGroupSettlements,
    getMySettlements,
    deleteSettlement,
    getSettlementById
} from "../controllers/settlement.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/", upload.single("proof"), createSettlement);
router.get("/group/:groupId", getGroupSettlements);
router.get("/:settlementId", getSettlementById);
router.get("/my", getMySettlements);
router.delete("/:settlementId", deleteSettlement);

export default router;
