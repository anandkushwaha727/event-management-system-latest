import { io } from "socket.io-client";

const socket = io("ws://localhost:8000");

socket.on("connect", () => {
    console.log("✅ Successfully connected to WebSocket!");
});

socket.on("connect_error", (err) => {
    console.error("❌ Connection Error:", err);
});
