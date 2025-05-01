import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
});

// Get receiver's socket id from the receiver's userId
export const getReceiverSocketId = (receiverId) => {
    const receiverSocketId = userSocketMap[receiverId];
    return receiverSocketId;
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);

    const userId = socket.handshake.query.userId;
    if (userId != undefined) {
        userSocketMap[userId] = socket.id;
    }
    console.log("User Socket Keys: ", Object.keys(userSocketMap));

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // socket.on() is used to listen to the events. can be used both on client and server side
    socket.on("disconnect", () => {
        console.log(`A user disconnected: ${socket.id}`);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };