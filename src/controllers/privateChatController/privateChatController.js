import PrivateChat from "../../models/privateChat/privateChat.model.js";


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
        const userId = mongoose.Types.ObjectId(req.params.userId);
        const chats = await PrivateChat.aggregate([
            { $match: { members: { $in: [userId] } } },
            {
                $lookup: {
                    from: "PrivateMessages",
                    let: { chatId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$chat", "$$chatId"] } } },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 }, {
                            $lookup: {
                                from: "Users",
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
            { $unwind: { path: "$lastMessage", preserveNullAndEmptyArrays: true } },
          
            {
                $lookup: {
                    from: "users",
                    localField: "members",
                    foreignField: "_id",
                    as: "members"
                }
            },
            {
                $project: {
                    "members.password": 0 
                }
            }
        ])
         res.json(chats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}