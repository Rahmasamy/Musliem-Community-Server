import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./basicSetupCloudinary.js";


export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "groups",
    allowed_formats: ["jpg", "png", "jpeg","webp"],
  },
});
