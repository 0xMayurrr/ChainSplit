import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";

import groupRoutes   from "./routes/groups";
import expenseRoutes from "./routes/expenses";
import userRoutes    from "./routes/users";

dotenv.config();

const app  = express();
const PORT = process.env.PORT ?? 3000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json({ limit: "2mb" }));

// rate limit — 100 requests per minute per IP
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, slow down." },
}));

// stricter limit on file upload routes
app.use("/api/groups/:address/receipt", rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: "Upload limit reached." },
}));

app.use("/api/groups",   groupRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/users",    userRoutes);

app.get("/health", (_req, res) => res.json({ status: "ok", env: process.env.NODE_ENV ?? "development" }));

// 404 handler
app.use((_req, res) => res.status(404).json({ error: "Route not found" }));

// global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

mongoose
  .connect(process.env.MONGODB_URI ?? "mongodb://localhost:27017/chainsplit")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT} [${process.env.NODE_ENV ?? "development"}]`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });
