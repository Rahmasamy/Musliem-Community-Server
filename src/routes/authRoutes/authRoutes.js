import express from "express";
import {
  registerUser,
  loginUser,
  refershToken,
  forgotPassword,
  checkResentCode,
  resetPassword,
} from "../../controllers/authController/authController.js";

import { protectResetPssword } from "../../middlewares/auth/protectRestPasswordMiddleware.js";
import { upload } from "../../middlewares/upload/uploadUserMiddleware.js";
import {
  assignRole,
  createUser,
  getAllUsers,
  getCountOfAllUsers,
} from "../../controllers/authController/user-crud/User.controller.js";
import protect from "../../middlewares/auth/authMiddleware.js";
import { checkUserItemsLimit } from "../../controllers/userItemLimitController/userItemLimitController.js";
const router = express.Router();

router.post("/register", upload.single("photo"), registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refershToken);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", checkResentCode);
router.post("/reset-password", protectResetPssword, resetPassword);
router.get("/users", getAllUsers); // GET /api/users
router.post("/user", createUser); // POST /api/users
router.get("/count-users", getCountOfAllUsers);
router.get("/check-limit", protect, checkUserItemsLimit);

router.put("/assign-role/:id", assignRole); // PUT /api/users/assign-role
export default router;
