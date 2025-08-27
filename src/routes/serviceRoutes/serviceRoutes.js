import express from "express";
import { createService, getServicesByType, updateService, deleteService } from "../../controllers/serviceController/serviceController.js";
import protect from "../../middlewares/auth/authMiddleware.js";
import authorize from "../../middlewares/authorizeMiddleware/authorizeMiddleware.js";

const serviceRouter = express.Router();

serviceRouter.post("/", protect, createService);
serviceRouter.get("/:type", getServicesByType);
serviceRouter.put("/:id", updateService);
serviceRouter.delete("/:id", deleteService);
export default serviceRouter;
