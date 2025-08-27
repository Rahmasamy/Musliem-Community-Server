import mongoose from "mongoose";
const ServiceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: "User",
    required: true
  },
  name: { type: String, required: true },        // e.g. Babysitter Name
  image: { type: String },                       // image path or URL
  description: { type: String },
  price: { type: Number },                       // optional for donation
  location: { type: String },
  phone: { type: String },
  serviceType: {                                  // e.g. babysitter, quran_tutor, donation, advertisement
    type: String,
    enum: ["babysitter", "quran_tutor", "donation", "advertisement"],
    required: true
  },
  extraDetails: { type: mongoose.Schema.Types.Mixed }, // Store dynamic fields
}, { timestamps: true });

export default mongoose.model("Service", ServiceSchema);
