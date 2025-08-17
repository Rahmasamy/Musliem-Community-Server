import Service from "../../models/Service/Service.model.js"

// apply for Role 
export const createService = async (req,res) => {
    try {
     const { name, image, description, price, location, phone, serviceType, extraDetails } = req.body;
     const service = new Service ({name,image,description,price,location,phone,serviceType,extraDetails})
     await service.save();
     res.status(201).json({
        message:"Service created successfully",
        service : service
     })
   
    }
    catch(error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// GET /services/:type
export const getServicesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const services = await Service.find({ serviceType: type });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
