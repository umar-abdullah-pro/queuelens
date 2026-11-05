import express from "express";

import {
  createStaffApplication,
  getPendingStaffApplications,
  approveStaffApplication,
  rejectStaffApplication,
} from "../controllers/staffApplicationController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const staffApplicaiotnRouter = express.Router();

// Public: submit staff application
staffApplicaiotnRouter.post("/", createStaffApplication);

// Admin only: view pending applications
staffApplicaiotnRouter.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getPendingStaffApplications,
);

staffApplicaiotnRouter.patch(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("admin"),
  approveStaffApplication,
);

staffApplicaiotnRouter.patch(
  "/:id/reject",
  authMiddleware,
  roleMiddleware("admin"),
  rejectStaffApplication,
);

export default staffApplicaiotnRouter;
