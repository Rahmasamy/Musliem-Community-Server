import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  price: { type: Number },
  location: { type: String },
  phone: { type: String },
  serviceType: {
    type: String,
    enum: ["babysitter", "quran_tutor", "donation", "advertisement"],
    required: true,
  },

  extraDetails: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    targetUrl: { type: String },
    position: {
      type: String,
      enum: ["home", "sidebar", "footer", "email"],
      default: "home",
    },
  },

  // ✅ New fields
  paymentStatus: {
    type: String,
    enum: ["pending", "confirmed", "failed"],
    default: "pending",
  },
  adminApprovalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
}, { timestamps: true });

ServiceSchema.index({ name: "text", description: "text", location: "text" });

export default mongoose.model("Service", ServiceSchema);
