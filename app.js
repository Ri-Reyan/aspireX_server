import express from "express";
import cookiesParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import errorHandler from "./src/middleware/error-middleware/errorHandler.middleware.js";
import userRoutes from "./src/routes/userRoutes/userRoutes.js";
import adminRoutes from "./src/routes/adminRoutes/adminRoutes.js";

const app = express();

const limiter = {
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiesParser());
// restrict origins to an allowlist if provided
const allowedOrigin = process.env.CORS_ORIGIN;
app.use(
  cors(
    allowedOrigin
      ? { origin: allowedOrigin, credentials: true }
      : { origin: true, credentials: true },
  ),
);
app.use(helmet());
// rate limiter applied globally; consider smaller limits for auth routes
limiter.limit = process.env.NODE_ENV === "production" ? 50 : 100;
app.use(rateLimit(limiter));

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// always use the error handler as the last middleware
app.use(errorHandler);

export default app;
