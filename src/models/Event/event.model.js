import mongoose from "mongoose";


const eventSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required:true
    },
      name: { type: String, required: true },
    description: { type: String },
    image: { type: String }, // event main image
    startTime: { type: String, required: true }, // "10:00 AM"
    endTime: { type: String, required: true },   // "12:00 PM"
    attendance: { 
      type: String, 
      enum: ["In-Person", "Virtual", "In-Person & Virtual"], 
      required: true 
    },
    invitationLink: { type: String },
    eventType: { type: String },
},{ timestamps:true}
)

export default mongoose.model("Event", eventSchema);