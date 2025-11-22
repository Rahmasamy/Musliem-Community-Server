import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    date : { type : Date ,required: true},
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    invitationLink: { type: String, required: false, default: "" },
    attendance: {
      type: String,
      enum: ["In-Person", "Virtual", "In-Person&Virtual"],
    },
    eventType: {
      type: String,
      enum: ["Networking", "Workshop", "Course", "Fundraiser", "other"],
    },
    Location: { type: String, required: false, default: "" },

    // ✅ new fields
    adminApprovalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

eventSchema.index({ name: "text", description: "text", Location: "text" });

export default mongoose.model("Event", eventSchema);
