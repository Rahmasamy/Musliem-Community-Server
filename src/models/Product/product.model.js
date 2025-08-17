import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    image: {
      type: String, // store URL or file path
      required: true
    },
    contactNumber: {
      type: String,
      required: true
    }
  },
  { timestamps: true } // adds createdAt and updatedAt
);

export default mongoose.model("Product", productSchema);
