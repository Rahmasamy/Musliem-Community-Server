import express from "express";
import { createService, getServicesByType, updateService, deleteService, getAllActiveAdvertisments, updatePaymentStatus, updateAdminApprovalStatus, getPendingAdertisments } from "../../controllers/serviceController/serviceController.js";
import protect from "../../middlewares/auth/authMiddleware.js";
import { upload } from "../../middlewares/upload/uploadServiceMiddleware.js";


const serviceRouter = express.Router();

// Configure multer for file uploads

serviceRouter.post("/", protect, upload.single("image"), createService);
serviceRouter.get("/active-advertisments", getAllActiveAdvertisments);
serviceRouter.get("/pending-advertisments", getPendingAdertisments);
serviceRouter.put("/payment/:id", updatePaymentStatus);
serviceRouter.put("/update-payment/:id", updateAdminApprovalStatus);
serviceRouter.put("/admin/:id", updateAdminApprovalStatus);
serviceRouter.get("/:type", getServicesByType);
serviceRouter.put("/:id", protect, upload.single("image"), updateService)
serviceRouter.delete("/:id", deleteService);
export default serviceRouter;
