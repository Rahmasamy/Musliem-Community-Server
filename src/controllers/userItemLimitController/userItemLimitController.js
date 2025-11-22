// controllers/userLimitController.js
import Service from "../../models/Service/Service.model.js";
import Product from "../../models/Product/product.model.js";
import Event from "../../models/Event/event.model.js";


export const checkUserItemsLimit = async (req, res) => {
  try {
    const userId = req.user._id; 

    const [serviceCount, productCount, eventCount] = await Promise.all([
      Service.countDocuments({ user: userId }),
      Product.countDocuments({ user: userId }),
      Event.countDocuments({ user: userId }),
    ]);
    const totalCount = serviceCount + productCount + eventCount;
    const canAddMore = totalCount < 10;

    return res.status(200).json({
      success: true,
      canAddMore,
      totalCount,
      serviceCount,
      productCount,
      eventCount,
    });
  } catch (error) {
    console.error("Error checking user items limit:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
