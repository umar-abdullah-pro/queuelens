import express from "express";

import {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
  checkInAppointment,
  getQueueStatus,
  getStaffQueue,
} from "../controllers/appointmentController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const appointmentRouter = express.Router();

// All appointment routes require authentication.
appointmentRouter.use(authMiddleware);

// Patient routes
appointmentRouter.post("/", roleMiddleware("patient"), createAppointment);

appointmentRouter.get("/mine", roleMiddleware("patient"), getMyAppointments);

appointmentRouter.patch(
  "/:id/cancel",
  roleMiddleware("patient"),
  cancelAppointment,
);

appointmentRouter.patch(
  "/:id/check-in",
  roleMiddleware("patient"),
  checkInAppointment,
);

appointmentRouter.get("/:id/queue", roleMiddleware("patient"), getQueueStatus);

// Staff route
appointmentRouter.get("/staff/queue", roleMiddleware("staff"), getStaffQueue);

export default appointmentRouter;
