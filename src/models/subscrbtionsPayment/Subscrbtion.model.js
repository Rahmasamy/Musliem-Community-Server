import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        planName: {
            type: String,
            required: true,
        },
        paypalSubscriptionId: {
            type: String, // اللي بيرجع من PayPal
            required: true,
            unique: true,
        },
        status: {
            type: String,
            enum: ["ACTIVE", "CANCELLED", "EXPIRED", "PENDING"],
            default: "PENDING",
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
        },
        nextBillingDate: {
            type: Date,
        },
        lastPayment: {
            amount: { type: Number },
            currency: { type: String },
            date: { type: Date },
        },
    },
    { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
