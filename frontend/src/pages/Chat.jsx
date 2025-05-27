import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const [socket, setSocket]       = useState(null);
  const [myId, setMyId]           = useState(null);
  const [message, setMessage]     = useState("");
  const [messages, setMessages]   = useState([]);

  const navigate = useNavigate();
  const token    = localStorage.getItem("token");
  const scrollRef = useRef();

  // 1) Redirect if not authenticated
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // 2) Connect to Socket.IO once on mount
  useEffect(() => {
    const sock = io("http://localhost:5000", {
      auth: { token },
    });
    setSocket(sock);

    // capture our own socket.id
    sock.on("connect", () => {
      setMyId(sock.id);
    });

    // listen for incoming messages
    sock.on("chat:receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => void sock.disconnect();
  }, [token]);

  // 3) Auto-scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4) Emit your message
  const sendMessage = () => {
    if (!message.trim() || !socket) return;
    const msg = {
      text:      message.trim(),
      senderId:  socket.id,
      timestamp: Date.now(),
    };
    // broadcast
    socket.emit("chat:sendMessage", msg);
    // locally append as well
    // setMessages((prev) => [...prev, msg]);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto border rounded">
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, i) => {
          const isSelf = msg.senderId === myId;
          return (
            <div
              key={i}
              className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg break-words ${
                  isSelf
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-900 shadow"
                }`}
              >
                <div className="text-xs text-gray-400 mb-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
                <div>{msg.text}</div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white flex items-center border-t">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-full py-2 px-4 mr-2 focus:outline-none"
          placeholder="Type your message…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 bg-green-600 hover:bg-green-700 text-white rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
}
