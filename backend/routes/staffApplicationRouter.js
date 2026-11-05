import express from "express";
import { createStaffApplication } from "../controllers/staffApplicationController.js";

const staffApplicationRouter = express.Router();

// Public route: submit a staff application
staffApplicationRouter.post("/", createStaffApplication);

export default staffApplicationRouter;
