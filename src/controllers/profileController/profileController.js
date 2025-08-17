import User from "../../models/User/User";
import Advertise from "../../models/advertise/advertise.model.js";
import Product from "../../models/Product/product.model.js";

export const getMyProfile = async (req, res) => {
  try {
    const profile = await User.findById(req.user.id); 
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createProfile = async (req, res) => {
  try {
    const profileData = req.body;
    if (req.file) {
      profileData.photo = req.file.filename;
    }
    const profile = await User.create(profileData);
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Update a profile
export const updateProfile = async (req, res) => {
  try {
    const profileData = req.body;
    if (req.file) {
      profileData.photo = req.file.filename;
    }
    const updatedProfile = await Profile.findByIdAndUpdate(req.user.id, profileData, { new: true });
    res.json(updatedProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const deleteProfile = async (req, res) => {
  try {
    await Profile.findByIdAndDelete(req.user.id);
    res.json({ message: "Profile deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getAllAdvertisementsForUser = async (req, res) => {
  try {
    const ads = await Advertise.find({ user:req.user.id})
    .sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getAllProductsForUser = async (req, res) => {
  try {
    const ads = await Product.find({ user:req.user.id})
    .sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logoutUser = (req, res) => {
  // Clear the JWT cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
};
