import mongoose from "mongoose";

const privateMessageSchema = new mongoose.Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "PrivateChat", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("PrivateMessage", privateMessageSchema);