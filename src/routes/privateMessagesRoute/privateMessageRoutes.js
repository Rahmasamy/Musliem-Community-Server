import express from "express";
import {
  getPrivateMessages,
  sendPrivateMessage
} from "../../controllers/privateMessageController/PrivateMessageController.js";

const privateMessageRouter = express.Router();

privateMessageRouter.get("/:chatId", getPrivateMessages);
privateMessageRouter.post("/", sendPrivateMessage);

export default privateMessageRouter;
