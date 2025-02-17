import React, { useState } from "react";
import useWebSocket from "./useWebSocket";

const ChatComponent = () => {
    const { messages, sendMessage } = useWebSocket();
    const [input, setInput] = useState("");

    return (
        <div>
            <h2>WebSocket Chat</h2>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={() => sendMessage(input)}>Send</button>
        </div>
    );
};

export default ChatComponent;
