import multer from "multer";
import { storage } from "../../config/userCloudinary.js";
export const upload = multer({ storage });
