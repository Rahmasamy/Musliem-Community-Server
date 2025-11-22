import multer from "multer";
import { storage } from "../../config/eventCloudinary.js";
export const upload = multer({ storage });
