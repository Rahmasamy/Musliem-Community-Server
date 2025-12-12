import Service from "../../models/Service/Service.model.js";

// apply for Role
export const createService = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      location,
      phone,
      serviceType,
      extraDetails,
    } = req.body;

    // Handle image upload (Cloudinary URL or local upload)
    let image = null;
    if (req.file && req.file.path) {
      image = req.file.path;
    }

    let parsedExtra = {};
    if (extraDetails) {
      try {
        parsedExtra =
          typeof extraDetails === "string"
            ? JSON.parse(extraDetails)
            : extraDetails;
      } catch {
        return res.status(400).json({ message: "Invalid extraDetails format" });
      }
    }

    if (serviceType === "advertisement") {
      const startDate = parsedExtra.startDate
        ? new Date(parsedExtra.startDate)
        : new Date();
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      parsedExtra = {
        ...parsedExtra,
        startDate,
        endDate,
      };
    }

    const service = new Service({
      user: req.user._id,
      name,
      image,
      description,
      price,
      location,
      phone,
      serviceType,
      extraDetails: parsedExtra,
    });

    await service.save();

    res.status(201).json({
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Create service error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET /services/:type
export const getServicesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { page = 1, limit = 3, search } = req.query;

    const skip = (page - 1) * limit;
    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const filter = { serviceType: type, ...searchFilter };

    const total = await Service.countDocuments(filter);

    const services = await Service.find(filter)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      services,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      location,
      phone,
      serviceType,
      extraDetails,
    } = req.body;

    // Handle image upload (Cloudinary URL)
    let image = null;
    if (req.file && req.file.path) {
      image = req.file.path; // URL من Cloudinary
    }

    // Build update object
    const updateData = {
      name,
      description,
      price,
      location,
      phone,
      serviceType,
      extraDetails: extraDetails ? JSON.parse(extraDetails) : {}, // parse JSON لو مبعوت كـ string
    };

    if (image) {
      updateData.image = image;
    }

    const service = await Service.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Delete Service
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllActiveAdvertisments = async (req, res) => {
  try {
    const now = new Date();

    const advertisements = await Service.find({
      serviceType: "advertisement",
      adminApprovalStatus: "approved",
      "extraDetails.startDate": { $lte: now },
      "extraDetails.endDate": { $gte: now },
    }).populate("user");

    res.json({
      message: "Successfully fetched active approved advertisements",
      success: true,
      data: advertisements,
    });
  } catch (err) {
    console.error("Error fetching advertisements:", err);
    res.status(500).json({
      message: "Error fetching advertisements",
      success: false,
    });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params; // service ID
    const { paymentStatus } = req.body;

    if (!["pending", "confirmed", "failed"].includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status value" });
    }

    const service = await Service.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true }
    );

    if (!service) return res.status(404).json({ message: "Service not found" });

    res.json({ message: "Payment status updated successfully", service });
  } catch (error) {
    res.status(500).json({ message: "Error updating payment status", error });
  }
};

// ✅ Update admin approval status
export const updateAdminApprovalStatus = async (req, res) => {
  try {
    const { id } = req.params; // service ID
    const { adminApprovalStatus } = req.body;

    if (!["pending", "approved", "rejected"].includes(adminApprovalStatus)) {
      return res
        .status(400)
        .json({ message: "Invalid admin approval status value" });
    }

    const service = await Service.findByIdAndUpdate(
      id,
      { adminApprovalStatus },
      { new: true }
    );

    if (!service) return res.status(404).json({ message: "Service not found" });

    res.json({
      message: "Admin approval status updated successfully",
      service,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating admin approval status", error });
  }
};

// Get all services with pending admin approval (and include user info)
export const getPendingAdertisments = async (req, res) => {
  try {
    const pendingServices = await Service.find({
      adminApprovalStatus: "pending",

      serviceType: "advertisement",
    }).populate("user", "fullName email phone photo");

    if (!pendingServices.length) {
      return res.status(200).json({
        success: true,
        message: "Pending advertisement empty",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Pending advertisement fetched successfully",
      data: pendingServices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching pending advertisement",
      error: error.message,
    });
  }
};
export const getAllPendingServices = async (req, res) => {
  try {
    const pendingServices = await Service.find({
      adminApprovalStatus: "pending",
    }).populate("user", "fullName email phone photo");

    if (!pendingServices.length) {
      return res.status(200).json({
        success: true,
        message: "No pending services found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Pending services fetched successfully",
      data: pendingServices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching pending services",
      error: error.message,
    });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const { page = 1, limit = 4, serviceType, search } = req.query;

    const query = {};

    // Filter by service type
    if (serviceType) {
      query.serviceType = serviceType;
    }

    // Regex search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const services = await Service.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Service.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: services,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
};
