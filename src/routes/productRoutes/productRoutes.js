import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getPendingProductsForAdmin,
  updateAdminProductApprovalStatus
} from "../../controllers/productController/productController.js";
import protect from "../../middlewares/auth/authMiddleware.js";
import { upload } from "../../middlewares/upload/uploadMiddleware.js";


const productRouter = express.Router();

// Configure multer for file uploads

productRouter.post("/", protect, upload.single("image"), createProduct);        // Create
productRouter.get("/", getProducts);           // Read all
productRouter.get("/pending", getPendingProductsForAdmin);
productRouter.get("/:id", getProductById);     // Read single
productRouter.put("/:id", protect, upload.single("image"), updateProduct);      // Update
productRouter.delete("/:id", protect, deleteProduct);   // Delete
productRouter.put("/update-admin-status/:id",protect,updateAdminProductApprovalStatus)
export default productRouter;
