import Service from "../../models/Service/Service.model.js"

// apply for Role 
export const createService = async (req, res) => {
  try {
    const { name, description, price, location, phone, serviceType, extraDetails } = req.body;
    
    // Handle image upload (store relative path)
    let image = null;
    if (req.file) {
      image = `uploads/${req.file.filename}`;
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
      extraDetails
    })
    await service.save();
    res.status(201).json({
      message: "Service created successfully",
      service: service
    })

  }
  catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

// GET /services/:type
export const getServicesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { page = 1, limit = 3 } = req.query;

    const skip = (page - 1) * limit;
    const total = await Service.countDocuments({ serviceType: type });

    const services = await Service.find({ serviceType: type })
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
    const { name, description, price, location, phone, serviceType, extraDetails } = req.body;

    // Handle image upload (store relative path)
    let image = null;
    if (req.file) {
      image = `uploads/${req.file.filename}`;
    }

    const updateData = { name, description, price, location, phone, serviceType, extraDetails };
    if (image) {
      updateData.image = image;
    }

    const service = await Service.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

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