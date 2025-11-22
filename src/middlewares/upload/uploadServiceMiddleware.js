import multer from "multer";
import { storage } from "../../config/serviceCloudinary.js";
export const upload = multer({ storage });
