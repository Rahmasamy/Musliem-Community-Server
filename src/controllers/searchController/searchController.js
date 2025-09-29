import Group from "../../models/Group/group.model.js";
import Service from "../../models/Service/Service.model.js";
import Product from "../../models/Product/product.model.js";
import Event from "../../models/Event/event.model.js";

export const searchAll = async (query) => {
  const regex = new RegExp(query, "i"); // case-insensitive

  const [services, groups, products,events] = await Promise.all([
    Service.find({ name: regex }).limit(5),  
    Group.find({ name: regex }).limit(5),
    Product.find({ name: regex }).limit(5),
    Event.find({ name: regex }).limit(5)
  ]);

  return { services, groups, products,events };
};

export const searchQuery = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Search query is required" });

    const results = await searchAll(q);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


