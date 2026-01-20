import { Router } from "express";
import {
    addExpense,
    getGroupExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense
} from "../controllers/expense.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/", addExpense);

router.get("/group/:groupId", getGroupExpenses);

router.get("/:expenseId", getExpenseById);

router.put("/:expenseId", updateExpense);

router.delete("/:expenseId", deleteExpense);

export default router;
