import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket.js";
import axios from "axios";
import { BASE_URL } from "../utils/constants.js";

const Chat = () => {
    const { targetUserId } = useParams();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isOnline, setIsOnline] = useState(false);

    const user = useSelector((store) => store.user);
    const userId = user?._id;

    // Socket reference
    const socketRef = useRef(null);

    // Reference to bottom of messages
    const messagesEndRef = useRef(null);

    // Auto scroll to latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    };

    const fetchChatMessages = async () => {
        try {
            const res = await axios.get(
                BASE_URL + "/chat/" + targetUserId,
                {
                    withCredentials: true,
                }
            );

            const chatMessages = res?.data?.messages?.map((msg) => {
                const { senderId, text,createdAt } = msg;

                return {
                    firstName: senderId?.firstName,
                    lastName: senderId?.lastName,
                    senderId: senderId?._id,
                    text,
                    createdAt,
                };
            }) || [];

            setMessages(chatMessages);

        } catch (err) {
            console.log(err);
        }
    };

    const formatTime = (date) => {
        if (!date) return "";

        const messageDate = new Date(date);

        if (isNaN(messageDate.getTime())) {
            return "";
        }

        return messageDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Fetch previous messages
    useEffect(() => {
        if (!targetUserId) return;

        fetchChatMessages();
    }, [targetUserId]);

    // Socket connection
    useEffect(() => {
        if (!userId || !targetUserId) return;

        const socket = createSocketConnection();

        socketRef.current = socket;

        socket.emit("joinChat", {
            firstName: user.firstName,
            userId,
            targetUserId,
        });

        socket.on("messageReceived", ({ firstName, lastName, text, senderId, createdAt }) => {

            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    firstName,
                    lastName,
                    senderId,
                    text,
                    createdAt,
                },
            ]);
        });

        socket.on("messageError", ({ message }) => {
            console.log(message);
        });

        socket.on("userOnline", ({ userId: onlineUserId }) => {

            if (
                onlineUserId?.toString() ===
                targetUserId?.toString()
            ) {
                setIsOnline(true);
            }
        });

        socket.on("userOffline", ({ userId: offlineUserId }) => {

            if (
                offlineUserId?.toString() ===
                targetUserId?.toString()
            ) {
                setIsOnline(false);
            }
        });

        return () => {

            socket.off("messageReceived");
            socket.off("userOnline");
            socket.off("userOffline");

            socket.disconnect();
        };

    }, [userId, targetUserId]);

    // Auto-scroll whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = () => {
        const text = newMessage.trim();

        if (!text) return;

        if (!socketRef.current) {
            console.log("Socket is not connected");
            return;
        }

        socketRef.current.emit("sendMessage", {
            firstName: user.firstName,
            userId,
            targetUserId,
            text,
        });

        setNewMessage("");
    };

    // Send message using Enter
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="w-full px-2 sm:px-4 py-4">

            <div className="w-full max-w-3xl mx-auto bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-700 bg-slate-800">

                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-white">
                            💬 Chat
                        </h1>

                        <p className="text-xs sm:text-sm text-slate-400 mt-1 truncate">
                            Connected with your match
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? "bg-emerald-400" : "bg-slate-500"}`}/>
                        <span className="text-sm text-slate-400">{isOnline ? "Online" : "Offline"}</span>
                    </div>
                </div>

                {/* Messages */}
                <div className="h-[55vh] min-h-[350px] overflow-y-auto p-3 sm:p-5 space-y-3 sm:space-y-4">

                    {messages.length === 0 ? (

                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-4xl sm:text-5xl mb-3">
                                    💬
                                </div>

                                <h2 className="text-lg sm:text-xl font-semibold text-white">
                                    No messages yet
                                </h2>

                                <p className="text-sm text-slate-400 mt-2">
                                    Start the conversation!
                                </p>
                            </div>
                        </div>

                    ) : (

                        messages.map((msg, index) => {

                            const isMyMessage =
                                msg.senderId === userId ||
                                msg.firstName === user.firstName;

                            return (
                                <div
                                    key={index}
                                    className={`chat ${
                                        isMyMessage
                                            ? "chat-end"
                                            : "chat-start"
                                    }`}
                                >

                                    <div className="chat-header text-slate-400 mb-1 text-xs sm:text-sm">
                                        {msg.firstName}
                                    </div>

                                    <div
                                        className={`chat-bubble max-w-[75%] sm:max-w-[65%] break-words ${
                                            isMyMessage
                                                ? "bg-indigo-500 text-white"
                                                : "bg-slate-700 text-white"
                                        } border border-slate-600 shadow-md`}
                                    >
                                        {msg.text}
                                    </div>
                                    <time className="block text-[10px] text-white/70 text-right mt-1">
                                        {formatTime(msg.createdAt)}
                                    </time>

                                </div>
                            );
                        })
                    )}

                    {/* Invisible element used for auto-scroll */}
                    <div ref={messagesEndRef} />

                </div>

                {/* Input */}
                <div className="p-3 sm:p-5 border-t border-slate-700 bg-slate-800">

                    <div className="flex items-center gap-2 sm:gap-3">

                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 min-w-0 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-xl px-3 sm:px-4 py-3 text-sm sm:text-base outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        />

                        <button
                            onClick={sendMessage}
                            className="btn bg-indigo-500 hover:bg-indigo-600 border-none text-white rounded-xl px-4 sm:px-6"
                        >
                            Send
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Chat;