import mongoose from "mongoose";


const MemberSubSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["admin", "member"], default: "member" }
}, { _id: false });

const groupSchema = new mongoose.Schema({
    name : {type : String,required:true},
    description : { type: String,required:true},
    image : { type: String,default:"https://d22r54gnmuhwmk.cloudfront.net/rendr-fe/img/default-organization-logo-6aecc771.gif"},
    joinOption : {
     type:String,
     enum : ["all", "premium"],
     default:"all"
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    members: [MemberSubSchema]
},{timestamps:true})

groupSchema.index({ name: "text", description: "text" });

export default mongoose.model("Group", groupSchema);