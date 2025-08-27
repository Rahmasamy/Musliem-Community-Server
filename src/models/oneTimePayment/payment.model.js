import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: "USD"
  },
  method: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed", "refunded"],
    default: "pending"
  },
  transactionId: { // ID from PayPal
    type: String,
    unique: true
  },
  orderId: { // لو عندك orders
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
