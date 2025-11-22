import multer from "multer";
import { storage } from "../../config/productCloudinary.js";

export const upload = multer({ storage });


