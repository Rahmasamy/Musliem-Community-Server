import { group } from "console";
import mongoose from "mongoose";
import { type } from "os";
import { ref } from "process";

const messageSchema = new mongoose.Schema({
    group : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Group",
         required: true 
    },
    sender : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
      text: { type: String },
  image: { type: String },
},{ timestamps: true })


export default mongoose.model("Message", messageSchema);
