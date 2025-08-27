import Advertise from "../../models/advertise/advertise.model.js";

export const createAdvertise = async (req, res) => {
  try {
    const newAd = await Advertise.create({...req.body,user: req.user._id });
    res.status(201).json(newAd);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllAdvertisements = async (req, res) => {
  try {
    const ads = await Advertise.find().sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





