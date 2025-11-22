// controllers/user.controller.js
import bcrypt from "bcryptjs";
import User from "../../../models/User/User.js";

// ✅ Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Create a new user
export const createUser = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Assign role to user
export const assignRole = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      { role: "admin" },
      { new: true }
    ).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Role assigned successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCountOfAllUsers = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ success: true, totalUsers: count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
