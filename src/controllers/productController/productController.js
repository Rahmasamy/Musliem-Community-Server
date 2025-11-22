import Product from "../../models/Product/product.model.js";

// Create product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, contactNumber } = req.body;

    const image = req.file ? req.file.path : null;

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
    const limit = 3;
    const skip = (page - 1) * limit;
    const { search } = req.query;

    // ✅ فلتر البحث
    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // ✅ الفلتر الكامل (يجيب approved فقط)
    const filter = {
      adminApprovalStatus: "approved",
      ...searchFilter,
    };

    // ✅ حساب العدد والإحضار
    const totalProducts = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate("user")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    res.json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
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


export const getPendingProductsForAdmin = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const filter = { adminApprovalStatus: "pending" };

    const total = await Product.countDocuments(filter);

    const pendingProducts = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "fullName email photo"); 

    res.status(200).json({
      pendingProducts,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error("Error fetching pending events:", error);
    res.status(500).json({ message: error.message });
  }
};


export const updateAdminProductApprovalStatus = async (req, res) => {
  try {
    const { id } = req.params; // service ID
    const { adminApprovalStatus } = req.body;

    if (!["pending", "approved", "rejected"].includes(adminApprovalStatus)) {
      return res
        .status(400)
        .json({ message: "Invalid admin approval status value" });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { adminApprovalStatus },
      { new: true }
    );

    if (!product) return res.status(404).json({ message: "Service not found" });

    res.json({
      message: "Admin approval status updated successfully",
      product,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating admin approval status", error });
  }
};