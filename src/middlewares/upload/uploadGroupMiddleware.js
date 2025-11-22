import multer from "multer";
import { storage } from "../../config/groupCloudinary.js";
export const upload = multer({ storage });
