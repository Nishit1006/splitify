import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import errorHandler from "./middlewares/error.middleware.js";

import healthRouter from "./routes/health.routes.js";
import userRouter from "./routes/user.routes.js";
import invitationRoutes from "./routes/invitation.routes.js";
import groupRoutes from "./routes/group.routes.js";
import groupMemberRoutes from "./routes/groupMember.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import settlementRoutes from "./routes/settlement.routes.js";
import balanceRoutes from "./routes/balance.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ---------- ROUTES ---------- */

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/users", userRouter);

app.use("/api/v1/groups", groupRoutes);
app.use("/api/v1/group-members", groupMemberRoutes);

app.use("/api/v1/invitations", invitationRoutes);
app.use("/api/v1/expenses", expenseRoutes);
app.use("/api/v1/settlements", settlementRoutes);
app.use("/api/v1/balances", balanceRoutes);
app.use("/api/v1/notifications", notificationRoutes);

/* ---------- ERROR HANDLER (ALWAYS LAST) ---------- */

app.use(errorHandler);

export default app;
