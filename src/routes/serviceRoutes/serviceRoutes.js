import express from "express";
import { createService,getServicesByType } from "../../controllers/serviceController/serviceController.js";
import protect from "../../middlewares/auth/authMiddleware.js";
import authorize from "../../middlewares/authorizeMiddleware/authorizeMiddleware.js";

const serviceRouter = express.Router();

serviceRouter.post("/",protect, authorize(['admin']),createService);
serviceRouter.get("/:type", getServicesByType);

export default serviceRouter;
