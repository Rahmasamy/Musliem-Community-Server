import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Report", "Suggest", "Other"],
      required: true,
    },
    headline: {
      type: String,
      required: false,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
