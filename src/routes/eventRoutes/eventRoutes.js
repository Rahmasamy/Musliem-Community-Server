// routes/eventRoutes.js
import express from "express";
import { createEvent, getAllEvents, getUserEvents } from "../../controllers/eventController/event.controller.js";
import protect from "../../middlewares/auth/authMiddleware.js";
import authorize from "../../middlewares/authorizeMiddleware/authorizeMiddleware.js";
const eventRouter = express.Router();

eventRouter.post("/", protect, createEvent);
eventRouter.get("/", getAllEvents);
eventRouter.get("/my-events", protect, getUserEvents);

export default eventRouter;
