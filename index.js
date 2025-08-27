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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const app = express();
//enable CORS
app.use(cors({
  origin: 'http://localhost:5173',   // ← الـ origin بتاع React
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

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
})
io.on("connection", (socket) => {
    console.log("socket connected", socket.id);
    socket.on("joinGroup", (groupId) => {
        socket.join(groupId)
        console.log(`${socket.id} joined ${groupId}`);
    })
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
            
      const populated = await msg.populate("sender", "name email").execPopulate?.() || msg;

      // emit to room
      io.to(payload.groupId).emit("receiveMessage", populated);
        }
        catch (error) {
            console.error("socket sendMessage error", err);
        }
    })
    socket.on("disconnect", () => {
    console.log("socket disconnected", socket.id);
  });
})
io.on("connection", (socket) => {
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
});

connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use(errorHandlerMiddleWare);
