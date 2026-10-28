import express from "express";
import {
  register,
  login,
  logout,
  getMe,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authmiddleware.js";

const authRouter = express.Router();

// Public routes
authRouter.post("/register", register);
authRouter.post("/login", login);

// Protected routes
authRouter.post("/logout", authMiddleware, logout);
authRouter.get("/me", authMiddleware, getMe);

export default authRouter;
