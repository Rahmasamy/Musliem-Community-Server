import Message from "../../models/Message/message.model.js";
import Group from "../../models/Group/group.model.js";
import mongoose from "mongoose";
// get messages in a group (paginated latest first)
export const getGroupMessages = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Message.find({ group: groupId }).skip(skip).limit(limit).populate("sender", "name email photo"),
      Message.countDocuments({ group: groupId })
    ]);

    res.json({ messages, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// create message via REST (the real-time socket will also emit)
export const createMessage = async (req, res) => {
  try {
    const { group, text } = req.body;
    const image = req.body.image || req.file?.path || "";
    const message = await Message.create({
      group,
      sender: req.user._id,
      text,
      image
    });
    // Optionally return populated message
    const populated = await message.populate("sender", "name email").execPopulate?.() || message;
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




export const getUserGroupsWithLastMessage = async (req, res) => {
  try {
    const userId = req.params.userId;

    const groups = await Group.aggregate([
      { $match: { "members.user": new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "messages",
          let: { groupId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$group", "$$groupId"] } } },
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
      { $unwind: { path: "$lastMessage", preserveNullAndEmptyArrays: true } }
    ]);

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

