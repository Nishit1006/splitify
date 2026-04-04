import { Router } from "express";
import {
    addExpense,
    getGroupExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense
} from "../controllers/expense.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/", upload.single("receipt"), addExpense);
router.get("/group/:groupId", getGroupExpenses);
router.get("/:expenseId", getExpenseById);
router.put("/:expenseId", upload.single("receipt"), updateExpense);
router.delete("/:expenseId", deleteExpense);

export default router;
