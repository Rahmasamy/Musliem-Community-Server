import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../../controllers/productController/productController.js";
import protect from "../../middlewares/auth/authMiddleware.js";

const productRouter = express.Router();

productRouter.post("/",protect, createProduct);        // Create
productRouter.get("/", getProducts);           // Read all
productRouter.get("/:id", getProductById);     // Read single
productRouter.put("/:id", protect,updateProduct);      // Update
productRouter.delete("/:id",protect, deleteProduct);   // Delete

export default productRouter;
