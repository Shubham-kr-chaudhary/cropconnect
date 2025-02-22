import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const sendMessage = () => {
    socket.emit("sendMessage", message);
    setMessages((prev) => [...prev, { text: message, sender: "You" }]);
    setMessage("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Chat</h1>
      <div className="border p-4 h-64 overflow-y-auto">
        {messages.map((msg, i) => (
          <p key={i} className={msg.sender === "You" ? "text-blue-500" : "text-gray-700"}>
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 ml-2">
          Send
        </button>
      </div>
    </div>
  );
}
