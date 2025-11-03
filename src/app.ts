import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import router from "./app/routes/index";

const app: Application = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://bobbin-frontend.vercel.app",
      "https://www.bobbinapparels.com",
      "https://bobbinapparels.com",
      "https://bobbin.com.bd",
      "https://www.bobbin.com.bd",
    ],
    credentials: true,
  }),
);

// Application routes
app.use("/api/v1", router);

// Health check endpoint (no CSRF protection)
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to Bobbin API",
    version: "1.0.0",
    documentation: "/api/v1/docs",
  });
});

// Global error handler
app.use(globalErrorHandler);

// // 404 handler - catch all unmatched routes
// app.all("*", (req: Request, res: Response) => {
//   res.status(404).json({
//     success: false,
//     message: "API endpoint not found",
//     path: req.originalUrl,
//   });
// });

export default app;
