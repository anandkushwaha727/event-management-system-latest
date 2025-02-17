import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const useWebSocket = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const newSocket = io("https://event-management-system-backend-sf2n.onrender.com"); // Adjust if deployed
        setSocket(newSocket);

        newSocket.on("message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        newSocket.on("connect", () => {
            console.log("✅ WebSocket Connected:", newSocket.id);
        });

        newSocket.on("disconnect", () => {
            console.log("❌ WebSocket Disconnected");
        });

        return () => newSocket.close();
    }, []);

    const sendMessage = (msg) => {
        if (socket) socket.emit("message", msg);
    };

    return { messages, sendMessage };
};

export default useWebSocket;
