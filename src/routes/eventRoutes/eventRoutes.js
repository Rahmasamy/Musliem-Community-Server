// routes/eventRoutes.js
import express from "express";
import { createEvent, getAllEvents, getUserEvents ,getEventById, getPendingEventsForAdmin, updateEventAdminApprovalStatus} from "../../controllers/eventController/event.controller.js";
import protect from "../../middlewares/auth/authMiddleware.js";
import { upload } from "../../middlewares/upload/uploadEventMiddleware.js";

const eventRouter = express.Router();

eventRouter.post("/", protect,upload.single("image"), createEvent);
eventRouter.get("/", getAllEvents);
eventRouter.get("/my-events", protect, getUserEvents);
eventRouter.get("/pending", protect, getPendingEventsForAdmin);
eventRouter.put("/update-admin-status/:id",protect,updateEventAdminApprovalStatus)

eventRouter.get("/:id", getEventById);

export default eventRouter;
