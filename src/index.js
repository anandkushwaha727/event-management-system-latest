import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import http from "http";  
import { Server } from "socket.io";  
import { connectDB } from "./database/database.connect.js";
import { app } from "./app.js";

console.log("🚀 Starting Server...");

// Create an HTTP server and attach Express to it  
const server = http.createServer(app);

// Attach WebSocket to the same server  
const io = new Server(server, {
    cors: {
        origin: "https://event-managementpuce.vercel.app",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("🔌 New client connected:", socket.id);

    socket.on("message", (msg) => {
        console.log("📨 Received:", msg);
        io.emit("message", msg); // Broadcast message to all clients
    });

    socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
    });
});
export { io };
// Connect to the database and start the server
connectDB()
    .then(() => {
        server.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️ Server is running at port: ${process.env.PORT || 8000}`);
        });
    })
    .catch((err) => {
        console.log("❌ MONGO DB connection failed!!!", err);
    });
