import express from "express";
import protect from "../../middlewares/auth/authMiddleware.js";
import {
  createGroup, getSingleGroup, getAllGroups, joinGroup, leaveGroup, getUserGroups
} from "../../controllers/groupController/group.controller.js";

const groupRouter = express.Router();

groupRouter.post("/", protect, createGroup);
groupRouter.get("/", getAllGroups);
groupRouter.get("/my-groups", protect, getUserGroups);
groupRouter.get("/:id", protect, getSingleGroup);
groupRouter.post("/:id/join", protect, joinGroup);
groupRouter.post("/:id/leave", protect, leaveGroup);

export default groupRouter;
 