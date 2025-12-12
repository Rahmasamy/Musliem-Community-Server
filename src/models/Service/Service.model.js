import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
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
      enum: [
        "babysitter",
        "quran_tutor",
        "donation",
        "advertisement",
        "consulting_services",
        "programming_web_app_development",
        "engineering_architecture_interior_design",
        "design_video_audio_production",
        "digital_marketing_sales",
        "writing_editing_translation_languages",
        "support_assistance_data_entry",
        "training_remote_education",
      ],
      required: true,
    },

    extraDetails: {
      startDate: { type: Date, required: false },
      endDate: { type: Date, required: false },
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
  },
  { timestamps: true }
);

ServiceSchema.index({ name: "text", description: "text", location: "text" });

export default mongoose.model("Service", ServiceSchema);
