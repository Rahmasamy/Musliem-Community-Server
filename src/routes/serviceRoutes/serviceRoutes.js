import express from "express";
import { createService, getServicesByType, updateService, deleteService } from "../../controllers/serviceController/serviceController.js";
import protect from "../../middlewares/auth/authMiddleware.js";
import authorize from "../../middlewares/authorizeMiddleware/authorizeMiddleware.js";
import multer from "multer";

const serviceRouter = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

serviceRouter.post("/", protect, upload.single("image"), createService);
serviceRouter.get("/:type", getServicesByType);
serviceRouter.put("/:id", protect, upload.single("image"), updateService);
serviceRouter.delete("/:id", deleteService);
export default serviceRouter;
