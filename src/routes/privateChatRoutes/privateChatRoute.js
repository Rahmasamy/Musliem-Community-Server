import express from "express";
import {
  createOrGetPrivateChat,
  getUserPrivateChats
} from "../../controllers/privateChatController/privateChatController.js";

const privateChatRouter = express.Router();

privateChatRouter.post("/", createOrGetPrivateChat);

privateChatRouter.get("/user/:userId", getUserPrivateChats);

export default privateChatRouter;