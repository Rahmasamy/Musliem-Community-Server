import PrivateChat from "../../models/privateChat/privateChat.model.js";
import mongoose from "mongoose";

export const createOrGetPrivateChat = async (req,res) => {
     const { userId1, userId2 } = req.body;
     try {
       let chat = await PrivateChat.findOne({
        members : { $all : [userId1,userId2]}
       })
       if(!chat) {
        chat = await PrivateChat.create({
            members:[userId1,userId2]
        })
       }
        res.json(chat);
     }
     catch (error) {
         res.status(500).json({ message: error.message });
     }
}

export const getUserPrivateChats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);

    const chats = await PrivateChat.aggregate([
      // 1️⃣ Match chats where user is a member
      { $match: { members: { $in: [userId] } } },

      // 2️⃣ Lookup last message
      {
        $lookup: {
          from: "privatemessages",
          let: { chatId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$chat", "$$chatId"] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
            {
              $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender"
              }
            },
            { $unwind: "$sender" }
          ],
          as: "lastMessage"
        }
      },

      // 3️⃣ Unwind lastMessage
      {
        $unwind: {
          path: "$lastMessage",
          preserveNullAndEmptyArrays: true
        }
      },

      // 4️⃣ Populate members
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "members"
        }
      },

      // 5️⃣ Remove sensitive fields
      {
        $project: {
          "members.password": 0
        }
      },

      // ✅ 6️⃣ Sort chats by last message time
      {
        $sort: {
          "lastMessage.createdAt": -1
        }
      }
    ]);

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
