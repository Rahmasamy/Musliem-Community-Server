import Product from "../../models/Product/product.model.js";

// Create product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, contactNumber } = req.body;
    
    // Handle image upload from 'image' field only
    const image = req.file ? `uploads/${req.file.filename}` : null; // relative path like other modules
    // If no image uploaded, the model will use its default image URL
    
    const product = await Product.create({ 
      name, 
      description, 
      price, 
      contactNumber,
      image,
      user: req.user._id 
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 3
    const skip = (page - 1) * limit;
    const totalProducts = await Product.countDocuments();
    const products = await Product.find().sort({ createdAt: -1 }).limit(limit).skip(skip);
    res.json({
      products: products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page

    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, contactNumber } = req.body;
    
    // Handle image upload from 'image' field only
    const image = req.file ? `uploads/${req.file.filename}` : null;
    
    const updateData = { name, description, price, contactNumber };
    if (image) {
      updateData.image = image;
    }
    
    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
