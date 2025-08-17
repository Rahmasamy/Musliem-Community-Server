import mongoose from "mongoose";

const advertiseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true
    },
  plan: { type: String, enum: ["website", "email"], required: true },
  businessName: { type: String, required: true },
  photo: { type: String }, // store image URL or filename
  address: { type: String, required: true },
  city: { type: String },
  state: { type: String },
  openTime: { type: String },
  endTime: { type: String },
  contactNumber: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Advertise", advertiseSchema);
