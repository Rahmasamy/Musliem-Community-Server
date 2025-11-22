// req.user._id

import PrivateMessage from "../../models/privateMessage/privateMessage.model.js";

export const getPrivateMessages = async (req, res) => {
  try {
    const messages = await PrivateMessage.find({ chat: req.params.chatId })
      .populate("sender", "name email photo") 
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("❌ Error fetching private messages:", error);
    res.status(500).json({ message: error.message });
  }
};

export const sendPrivateMessage = async (req, res) => {
  const { chatId, senderId, text, image } = req.body;

  try {
    const msg = await PrivateMessage.create({
      chat: chatId,
      sender: senderId,
      text,
      image: image || "",
    });

    const populated = await msg.populate("sender", "name email");

    // لو فيه socket.io ممكن نعمل:
    // io.to(chatId).emit("receivePrivateMessage", populated);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
