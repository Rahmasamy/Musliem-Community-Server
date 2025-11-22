import mongoose from "mongoose";

const DeletedAdSchema = new mongoose.Schema({
  originalAdId: { type: mongoose.Schema.Types.ObjectId, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  description: String,
  image: String,
  extraDetails: mongoose.Schema.Types.Mixed,
  deletedAt: { type: Date, default: Date.now }
});

export default mongoose.model("DeletedAd", DeletedAdSchema);
