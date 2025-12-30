import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import errorHandler from "./middlewares/error.middleware.js";
import healthRouter from "./routes/health.routes.js";
import userRouter from "./routes/user.routes.js";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ THIS WAS MISSING
app.use(cookieParser());

// ✅ ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/health", healthRouter);

// ✅ ERROR HANDLER MUST BE LAST
app.use(errorHandler);

export default app;
