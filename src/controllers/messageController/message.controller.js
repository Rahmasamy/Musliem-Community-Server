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
      Message.find({ group: groupId })
        .skip(skip)
        .limit(limit)
        .populate("sender", "name email photo"),
      Message.countDocuments({ group: groupId }),
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
    const userId = req.user._id;

    const groupExists = await Group.exists({ _id: group });
    if (!groupExists) {
      return res.status(404).json({ message: "Group not found" });
    }

    await Group.findByIdAndUpdate(group, {
      $addToSet: {
        members: { user: userId, role: "member" },
      },
    });

    const message = await Message.create({
      group,
      sender: userId,
      text,
      image,
    });

    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "name email"
    );

    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error("Create message error:", err);
    res.status(500).json({ message: err.message });
  }
};


export const getUserGroupsWithLastMessage = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);

   const groups = await Group.aggregate([
  {
    $match: {
      members: {
        $elemMatch: { user: userId }
      }
    }
  },
  {
    $lookup: {
      from: "messages",
      let: { groupId: "$_id" },
      pipeline: [
        { $match: { $expr: { $eq: ["$group", "$$groupId"] } } },
        { $sort: { createdAt: -1 } }, // latest message
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
  { $unwind: { path: "$lastMessage", preserveNullAndEmptyArrays: true } },

  // ✅ THIS is what you were missing
  {
    $sort: {
      "lastMessage.createdAt": -1
    }
  }
]);


    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

