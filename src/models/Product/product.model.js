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
      required: true,
      default : "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.dell.com%2Fen-uk%2Fshop%2Fdell-laptops%2Fscr%2Flaptops&psig=AOvVaw3suT_a23umOtFLKPIxSTQX&ust=1756297474373000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCODamoy8qI8DFQAAAAAdAAAAABAE"
    },
    contactNumber: {
      type: String,
      required: true
    }
  },
  { timestamps: true } // adds createdAt and updatedAt
);

export default mongoose.model("Product", productSchema);
