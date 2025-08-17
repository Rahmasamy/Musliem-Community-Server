import express from "express";
import protect from "../../middlewares/auth/authMiddleware.js";
import { getGroupMessages, createMessage,getUserGroupsWithLastMessage } from "../../controllers/messageController/message.controller.js";

const messageRouter = express.Router();
messageRouter.get("/:groupId", protect, getGroupMessages);
messageRouter.post("/", protect, createMessage);
messageRouter.get("/user/:userId", getUserGroupsWithLastMessage);

export default messageRouter;
