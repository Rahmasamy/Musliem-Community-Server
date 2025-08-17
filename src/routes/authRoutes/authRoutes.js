import express from 'express';
import { registerUser, loginUser, refershToken, forgotPassword, checkResentCode, resetPassword } from '../../controllers/authController/authController.js';
import multer from "multer";

import { protectResetPssword } from '../../middlewares/auth/protectRestPasswordMiddleware.js';
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null,  Date.now() + "-" + file.originalname)
})
const upload = multer({ storage });

router.post('/register',
    upload.fields([
        { name: "photo", maxCount: 1 },
        { name: "businessPhoto", maxCount: 1 }
    ])
    , registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refershToken);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-code', checkResentCode);
router.post('/reset-password', protectResetPssword, resetPassword);

export default router;
