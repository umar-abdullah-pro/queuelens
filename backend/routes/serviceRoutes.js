import express from "express";

import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deactivateService,
} from "../controllers/serviceController.js";

import {
  authMiddleware,
  roleMiddleware,
} from "../middlewares/authmiddleware.js";

const serviceRouter = express.Router();

// Read routes: publicly available active services
serviceRouter.get("/", getServices);
serviceRouter.get("/:id", getServiceById);

// Write routes: admins only
serviceRouter.post("/", authMiddleware, roleMiddleware("admin"), createService);

serviceRouter.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateService,
);

serviceRouter.patch(
  "/:id/deactivate",
  authMiddleware,
  roleMiddleware("admin"),
  deactivateService,
);

export default serviceRouter;
