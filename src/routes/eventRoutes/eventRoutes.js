// routes/eventRoutes.js
import express from "express";
import { createEvent, getAllEvents, getUserEvents ,getEventById} from "../../controllers/eventController/event.controller.js";
import protect from "../../middlewares/auth/authMiddleware.js";
import multer from "multer";

const eventRouter = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null,  Date.now() + "-" + file.originalname)
})
const upload = multer({ storage });
eventRouter.post("/", protect,upload.single("image"), createEvent);
eventRouter.get("/", getAllEvents);
eventRouter.get("/my-events", protect, getUserEvents);
eventRouter.get("/:id", getEventById);

export default eventRouter;
