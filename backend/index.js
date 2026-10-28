import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";
import sessionMiddleware from "./config/session.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is missing from environment variables.");
}

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is missing from environment variables.");
}

// Configure CORS before session middleware.
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware must run before routes that use req.session.
app.use(sessionMiddleware);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "QueueLens API is running.",
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Start only after the database connects.
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`QueueLens API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start QueueLens:", error);
    process.exit(1);
  }
};

startServer();