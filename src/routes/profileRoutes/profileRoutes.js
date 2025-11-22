import multer from "multer";

import {
    createProfile,
    getMyProfile,
    getAllProductsForUser,
    getAllAdvertisementsForUser,
    logoutUser,
    updateProfile,
    deleteProfile,
    updatePassword
} from "../../controllers/profileController/profileController.js";
import protect from "../../middlewares/auth/authMiddleware.js";
import express from "express";
import { upload } from "../../middlewares/upload/uploadUserMiddleware.js";

const profileRouter = express.Router();



profileRouter.post("/", upload.single("photo"), createProfile);
profileRouter.get("/me", protect, getMyProfile);
profileRouter.get("/products", protect, getAllProductsForUser);
profileRouter.get("/advertisments", protect, getAllAdvertisementsForUser);
profileRouter.post("/logout", logoutUser);
profileRouter.put("/", upload.single("photo"), protect, updateProfile);
profileRouter.put("/change-password", protect, updatePassword);
profileRouter.delete("/", protect, deleteProfile);

export default profileRouter;