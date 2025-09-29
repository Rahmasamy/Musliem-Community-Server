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
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    invitationLink: { type: String,required:false,default:"" },
    attendance: { type:String,enum: ["In-Person","Virtual","In-Person&Virtual"] },
    eventType: { type:String,enum:["Networking","Workshop","Course","Fundraiser","other"]},
    Location: {type:String,required:false,default:""}
    ,
  },
  { timestamps: true }
);
eventSchema.index({ name: "text", description: "text", Location: "text" });

export default mongoose.model("Event", eventSchema);
