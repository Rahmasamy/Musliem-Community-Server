import User from "../../models/User/User.js";
import Product from "../../models/Product/product.model.js";
import bcrypt from "bcryptjs";
import Service from "../../models/Service/Service.model.js";
export const getMyProfile = async (req, res) => {
  try {
    const profile = await User.findById(req.user._id);
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
      profileData.photo = `uploads/${req.file.filename}`;
    }
    const updatedProfile = await User.findByIdAndUpdate(req.user._id, profileData, { new: true });
    res.json(updatedProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const deleteProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: "Profile deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getAllAdvertisementsForUser = async (req, res) => {
  try {
    const ads = await Service.find({ user: req.user._id, serviceType: "advertisement" })
      .sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getAllProductsForUser = async (req, res) => {
  try {
    const ads = await Product.find({ user: req.user._id })
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
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" })

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)

    await user.save();
    res.json({
      message: "Password updated successfully"
    })
  }
  catch (err) {
    res.status(500).json({ message: err.message })
  }
}
