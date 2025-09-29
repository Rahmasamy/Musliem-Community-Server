import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../../controllers/productController/productController.js";
import protect from "../../middlewares/auth/authMiddleware.js";
import multer from "multer";

const productRouter = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

productRouter.post("/", protect, upload.single("image"), createProduct);        // Create
productRouter.get("/", getProducts);           // Read all
productRouter.get("/:id", getProductById);     // Read single
productRouter.put("/:id", protect, upload.single("image"), updateProduct);      // Update
productRouter.delete("/:id", protect, deleteProduct);   // Delete

export default productRouter;
