const socket=require("socket.io")
const crypto=require("crypto")
const {Chat} = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const initializeSocket=(server)=>{

    const getSecretRoomId=(userId,targetUserId)=>{
       return  crypto.createHash("sha256").update([userId,targetUserId].sort().join("_")).digest("hex")
    }

    const io = socket(server, {
        cors: {
            origin: [
                "http://localhost:5174",
                "http://localhost:5173",
                "https://devtinder.dpdns.org",
            ],
            credentials: true,
            methods: ["GET", "POST"],
        },
    });

    io.on("connection",(socket)=>{
        const onlineUsers = new Map();
        //Handle events

            socket.on("joinChat", ({ firstName, userId, targetUserId }) => {

                const roomId = getSecretRoomId(
                    userId,
                    targetUserId
                );

                socket.join(roomId);

                // Save user ID on this socket
                socket.userId = userId;

                // Add socket to user's connections
                if (!onlineUsers.has(userId)) {
                    onlineUsers.set(userId, new Set());
                }

                onlineUsers.get(userId).add(socket.id);

                // Check if target user is already online
                if (
                    onlineUsers.has(targetUserId) &&
                    onlineUsers.get(targetUserId).size > 0
                ) {
                    socket.emit("userOnline", {
                        userId: targetUserId
                    });
                }

                // Tell target user that current user is online
                socket.to(roomId).emit("userOnline", {
                    userId
                });
            });

        socket.on("sendMessage", async ({ firstName, userId, targetUserId, text }) => {
            try {
                // Check whether users are connected
                const connection = await ConnectionRequest.findOne({
                    $or: [
                        {
                            fromUserId: userId,
                            toUserId: targetUserId,
                            status: "accepted",
                        },
                        {
                            fromUserId: targetUserId,
                            toUserId: userId,
                            status: "accepted",
                        },
                    ],
                });

                if (!connection) {
                    return socket.emit("messageError", {
                        message: "You can only message your connections",
                    });
                }

                // Validate message
                if (!text || !text.trim()) {
                    return socket.emit("messageError", {
                        message: "Message cannot be empty",
                    });
                }

                if (text.length > 500) {
                    return socket.emit("messageError", {
                        message: "Message cannot exceed 500 characters",
                    });
                }

                const roomId = getSecretRoomId(userId, targetUserId);

                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId] },
                });

                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: [],
                    });
                }

                chat.messages.push({
                    senderId: userId,
                    text: text.trim(),
                });

                await chat.save();

                io.to(roomId).emit("messageReceived", {
                    firstName,
                    text: text.trim(),
                    senderId: userId,
                    createdAt: new Date().toISOString(),
                });

            } catch (err) {
                console.log(err);

                socket.emit("messageError", {
                    message: "Something went wrong",
                });
            }
        });

        socket.on("disconnect", () => {

            const userId = socket.userId;

            if (!userId) return;

            const userSockets = onlineUsers.get(userId);

            if (!userSockets) return;

            userSockets.delete(socket.id);

            // No other tabs/devices are connected
            if (userSockets.size === 0) {

                onlineUsers.delete(userId);

                io.emit("userOffline", {
                    userId
                });

            }
        });
    })

}

module.exports=initializeSocket