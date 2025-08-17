import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../../controllers/productController/productController.js";

const productRouter = express.Router();

productRouter.post("/", createProduct);        // Create
productRouter.get("/", getProducts);           // Read all
productRouter.get("/:id", getProductById);     // Read single
productRouter.put("/:id", updateProduct);      // Update
productRouter.delete("/:id", deleteProduct);   // Delete

export default productRouter;
