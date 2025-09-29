import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import router from './src/routes/authRoutes/authRoutes.js';
import serviceRouter from './src/routes/serviceRoutes/serviceRoutes.js'
import eventRouter from './src/routes/eventRoutes/eventRoutes.js'
import groupRouter from './src/routes/groupRoutes/groupRoutes.js';
import messageRouter from './src/routes/messageRoutes/messageRoutes.js';
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import privateChatRouter from './src/routes/privateChatRoutes/privateChatRoute.js';
import privateMessageRouter from './src/routes/privateMessagesRoute/privateMessageRoutes.js';
import productRouter from './src/routes/productRoutes/productRoutes.js';
import advertiseRouter from './src/routes/advertiseRoutes/advertiseRoutes.js';
import cookieParser from 'cookie-parser';
import errorHandlerMiddleWare from './src/middlewares/errorHandleMiddleware/errorHandle.js';
import path from 'path';
import { fileURLToPath } from "url";
import { dirname } from "path";
import profileRouter from './src/routes/profileRoutes/profileRoutes.js';
import searchRouter from './src/routes/searchRouter/searchRouter.js';
import Message from './src/models/Message/message.model.js';
import PrivateMessage from './src/models/privateMessage/privateMessage.model.js';
import bodyParser from "body-parser";
import paymentRouter from './src/routes/paymentRoutes/paymentRoutes.js';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const app = express();
app.use(bodyParser.json());

//enable CORS
app.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}));

// Body parser
app.use(express.json());

app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Routes
app.use('/api/auth', router);
app.use("/api/services", serviceRouter);
app.use('/api/events', eventRouter)
app.use('/api/groups', groupRouter)
app.use('/api/messages', messageRouter)
app.use("/api/private-chats", privateChatRouter);
app.use("/api/private-messages", privateMessageRouter);
app.use("/api/products", productRouter);
app.use("/api/advertise", advertiseRouter);
app.use("/api/profile", profileRouter);
app.use("/api/search", searchRouter);
app.use("/api",paymentRouter)
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
})
io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`${socket.id} joined ${groupId}`);
  });

  socket.on("leaveGroup", (groupId) => {
    socket.leave(groupId);
  });

  socket.on("sendMessage", async (payload) => {
    try {
      const msg = await Message.create({
        group: payload.groupId,
        sender: payload.senderId,
        text: payload.text,
        image: payload.image || ""
      });

      const populated = await msg.populate("sender", "name email");
      io.to(payload.groupId).emit("receiveMessage", populated);
      console.log("message sent ")
    } catch (err) {
      console.error("socket sendMessage error", err);
    }
  });

  // private chat
  socket.on("joinPrivateChat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("sendPrivateMessage", async (payload) => {
    const msg = await PrivateMessage.create({
      chat: payload.chatId,
      sender: payload.senderId,
      text: payload.text,
      image: payload.image || ""
    });

    const populated = await msg.populate("sender", "name email");
    io.to(payload.chatId).emit("receivePrivateMessage", populated);
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected", socket.id);
  });
});


connectDB();
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use(errorHandlerMiddleWare);
