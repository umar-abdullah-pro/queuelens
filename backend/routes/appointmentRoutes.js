import express from "express";

import {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
  checkInAppointment,
  getQueueStatus,
  getStaffQueue,
  startAppointment,
  completeAppointment,
} from "../controllers/appointmentController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const appointmentRouter = express.Router();
appointmentRouter.use(authMiddleware);

appointmentRouter.get("/mine", roleMiddleware("patient"), getMyAppointments);

appointmentRouter.post("/", roleMiddleware("patient"), createAppointment);

appointmentRouter.get("/staff/queue", roleMiddleware("staff"), getStaffQueue);

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

appointmentRouter.patch(
  "/:id/start",
  roleMiddleware("staff"),
  startAppointment,
);

appointmentRouter.patch(
  "/:id/complete",
  roleMiddleware("staff"),
  completeAppointment,
);

export default appointmentRouter;
