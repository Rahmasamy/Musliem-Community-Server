import express from "express";
import protect from "../../middlewares/auth/authMiddleware.js";
import {
  createGroup, getSingleGroup, getAllGroups, joinGroup, leaveGroup, getUserGroups
} from "../../controllers/groupController/group.controller.js";
import multer from "multer";

const groupRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null,  Date.now() + "-" + file.originalname)
})
const upload = multer({ storage });

groupRouter.post("/",protect,upload.single("image"),  createGroup);
groupRouter.get("/", getAllGroups);
groupRouter.get("/my-groups", protect, getUserGroups);
groupRouter.get("/:id", getSingleGroup);
groupRouter.post("/:id/join", protect, joinGroup);
groupRouter.post("/:id/leave", protect, leaveGroup);

export default groupRouter;
 