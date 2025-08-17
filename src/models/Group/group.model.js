import mongoose from "mongoose";


const MemberSubSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["admin", "member"], default: "member" }
}, { _id: false });

const groupSchema = new mongoose.Schema({
    name : {type : String,required:true},
    describtion : { type: String,required:true},
    image : { type: String,default:null},
    joinOption : {
     type:String,
     enu : ["all", "premium"],
     default:"all"
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    member: [MemberSubSchema]
},{timestamps:true})

export default mongoose.model("Group", groupSchema);