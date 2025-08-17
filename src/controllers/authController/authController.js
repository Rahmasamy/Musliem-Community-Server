import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../../services/Email/emailService.js';
// import asyncHandler from "../utils/asyncHandler.js";
import asyncHandler from '../../utils/asyncHandler.js';
import User from '../../models/User/User.js';
// Generate JWT Token
const generateToken = (id, role) => {
    console.log("generate code jwt secret", process.env.JWT_SECRET)
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

// refrsh token 
const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
};
const generateHtmlTemplate = (user, resetCode) => {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f9f9f9; padding: 20px; border-radius: 10px;">
        <h2 style="color: #088c81ff; text-align: center;">🔐 Password Reset Request</h2>
        <p style="font-size: 16px; color: #333;">
          Hi <strong>${user.fullName || 'User'}</strong>,<br><br>
          We received a request to reset your password. Use the code below to proceed:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 28px; font-weight: bold; color: #088c81ff; background: #fff; padding: 10px 20px; border-radius: 8px; border: 2px solid #4CAF50;">
            ${resetCode}
          </span>
        </div>
        <p style="font-size: 14px; color: #555;">
          This code will expire in <strong>10 minutes</strong>. If you didn’t request a password reset, please ignore this email.
        </p>
        <hr style="border: none; height: 1px; background: #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #888; text-align: center;">
          &copy; ${new Date().getFullYear()} Muslim Community App. All rights reserved.
        </p>
      </div>
    `;
    return html;
}

// @desc    Register user
// @route   POST /api/auth/register


export const registerUser = asyncHandler(async (req, res) => {
    const {
        fullName,
        email,
        password,
        phoneNumber,
        skills,
        otherSkill,
        bio,
        role
    } = req.body;

    // validate required fields
    if (!fullName || !email || !password) {
        res.status(400);
        throw new Error("Full name, email and password are required");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(409);
        throw new Error("User already exists");
    }

    // extract uploaded files (profile + business photo)
    const profilePhoto = req.files?.photo ? req.files.photo[0].filename : null;
    const businessPhoto = req.files?.businessPhoto ? req.files.businessPhoto[0].filename : null;

    const user = await User.create({
        fullName,
        email,
        password,
        phoneNumber,
        skills,
        otherSkill,
        bio,
        role,
        profilePhoto,
        businessPhoto
    });

    res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role)
    });
});

// @desc    Login user
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
        const accessToken = generateToken(user._id, user.role)
        const refreshToken = generateRefreshToken(user);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            token: accessToken
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const refershToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const newAccessToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );
        res.json({ accessToken: newAccessToken });
    })
}

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        console.log(user)
        if (!user) return res.status(404).json({ message: 'No user with that email' });

        // Generate 6-digit numeric code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash code before saving to DB (for security)
        const hashedCode = crypto.createHash('sha256').update(resetCode).digest('hex');

        // Save to user document with expiry
        user.resetPasswordToken = hashedCode;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();



        const html = generateHtmlTemplate(user, resetCode)
        try {
            await sendEmail({
                to: user.email,
                subject: 'Password Reset Code',
                html: html
            });

            res.json({ message: 'Reset code sent to your email' });
        } catch (err) {
            // Cleanup if email fails
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            res.status(500).json({ message: `Email could not be sent ${err}` });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};



export const checkResentCode = async (req, res) => {
    try {
        const code = req.body.code
        if (!code) {
            return res.status(400).json({
                message: "Rest Code is required"
            })
        }
        const hashedCode = crypto.createHash('sha256').update(code).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedCode,
            resetPasswordExpire: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset code' });
        }
        const tempToken = jwt.sign(
            { id: user._id, purpose: 'resetPassword' },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.json({ message: 'Code is valid', token: tempToken });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }



}


export const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const { id, purpose } = req.user
        if (purpose !== 'resetPassword') {
            return res.status(403).json({ message: 'Invalid token purpose' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = password; // will be hashed by pre-save middleware
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }

}