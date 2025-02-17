import { io } from "socket.io-client";

const socket = io("https://event-management-system-backend-sf2n.onrender.com");

socket.on("connect", () => {
    console.log("✅ Connected to WebSocket server");
});

socket.on("eventCreated", (event) => {
    console.log("🆕 New Event Created:", event);
});

socket.on("eventUpdated", (event) => {
    console.log("✏️ Event Updated:", event);
});

socket.on("eventDeleted", ({ eventId }) => {
    console.log("🗑️ Event Deleted:", eventId);
});

socket.on("disconnect", () => {
    console.log("❌ Disconnected from WebSocket server");
});
