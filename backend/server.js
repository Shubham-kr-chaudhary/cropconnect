require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 1) CONNECT TO MONGODB ATLAS
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 2) DEFINE ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/crops", require("./routes/crop"));
app.use("/api/user", require("./routes/user"));
app.use("/api/orders", require("./routes/order"));


// 3) SETUP SOCKET.IO SERVER
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" }, // Allow all origins (Change to your frontend URL in production)
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  // Example: Handle custom events (Modify based on your needs)
  socket.on("sendMessage", (message) => {
    console.log("New Message:", message);
    io.emit("receiveMessage", message); // Broadcast to all clients
  });
});

// 4) START THE SERVER
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
server.listen(5000, () => console.log(`✅ Server running on port 5000`));