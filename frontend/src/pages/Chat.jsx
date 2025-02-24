
// import { useEffect, useState } from "react";
// import io from "socket.io-client";

// const socket = io("http://localhost:5000");

// export default function Chat() {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     socket.on("receiveMessage", (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     });

//     return () => socket.off("receiveMessage");
//   }, []);

//   const sendMessage = () => {
//     if (message.trim() === "") return;
//     socket.emit("sendMessage", message);
//     setMessages((prev) => [...prev, { text: message, sender: "You" }]);
//     setMessage("");
//   };

//   return (
//     // {/* 
//     //   Use h-full or flex-1 so it fills the parent's height (set by Layout). 
//     //   Remove h-screen. 
//     // */}
//     <div className="flex flex-col h-full">
//       {/* Chat messages area */}
//       <div className="bg-gray-200 flex-1 overflow-y-auto">
//         <div className="px-4 py-2">
//           {messages.map((msg, i) =>
//             msg.sender === "You" ? (
//               <div key={i} className="flex items-center justify-end mb-2">
//                 <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
//                   {msg.text}
//                 </div>
//                 <img
//                   className="w-8 h-8 rounded-full"
//                   src="https://picsum.photos/50/50"
//                   alt="User Avatar"
//                 />
//               </div>
//             ) : (
//               <div key={i} className="flex items-center mb-2">
//                 <img
//                   className="w-8 h-8 rounded-full mr-2"
//                   src="https://picsum.photos/50/50"
//                   alt="User Avatar"
//                 />
//                 <div className="bg-white rounded-lg p-2 shadow mb-2 max-w-sm text-gray-900">
//                   {msg.text}
//                 </div>
//               </div>
//             )
//           )}
//         </div>
//       </div>

//       {/* Input area */}
//       <div className="bg-gray-100 px-4 py-2">
//         <div className="flex items-center">
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             className="w-full border rounded-full py-2 px-4 mr-2 text-gray-900"
//             placeholder="Type your message..."
//           />
//           <button
//             onClick={sendMessage}
//             className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // for redirecting
import {io} from "socket.io-client";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // 1) Check for token on mount; if none, redirect to /login
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
  }, [token, navigate]);

  // 2) Initialize socket only if token exists
  const socket = io("http://localhost:5000");

  // 3) Listen for incoming messages
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Cleanup on unmount
    return () => socket.off("receiveMessage");
    // eslint-disable-next-line
  }, []); // We skip token here because we only set up the socket once

  // 4) Send a message
  const sendMessage = () => {
    if (message.trim() === "") return;
    socket.emit("sendMessage", message);
    setMessages((prev) => [...prev, { text: message, sender: "You" }]);
    setMessage("");
  };

  // 5) Render Chat UI
  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="bg-gray-200 flex-1 overflow-y-auto">
        <div className="px-4 py-2">
          {messages.map((msg, i) =>
            msg.sender === "You" ? (
              <div key={i} className="flex items-center justify-end mb-2">
                <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
                  {msg.text}
                </div>
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://picsum.photos/50/50"
                  alt="User Avatar"
                />
              </div>
            ) : (
              <div key={i} className="flex items-center mb-2">
                <img
                  className="w-8 h-8 rounded-full mr-2"
                  src="https://picsum.photos/50/50"
                  alt="User Avatar"
                />
                <div className="bg-white rounded-lg p-2 shadow mb-2 max-w-sm text-gray-900">
                  {msg.text}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="bg-gray-100 px-4 py-2">
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border rounded-full py-2 px-4 mr-2 text-gray-900"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
