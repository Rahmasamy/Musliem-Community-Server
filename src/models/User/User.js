// models/user.model.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  phoneNumber: {
    type: String,
    default: null
  },
  photo: {
    type: String, // store file path or cloud URL
    default: null
  },

  // Step 2: More Info
  skills: {
    type: [String],
    default: []
  },
  otherSkill: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['individual', 'non-profit-organization', 'business-owner', 'admin'],
    default: 'guest'
  },
  businessPhoto: {
    type: String,
    default: null
  },

  // Account control
  isActive: {
    type: Boolean,
    default: true
  },

  // For password reset
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Encrypt password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
