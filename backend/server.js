require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const paymentsRouter = require("./routes/payments");

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
app.use("/api/payments", paymentsRouter);

// 3) SETUP SOCKET.IO SERVER
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" }, // your React dev URL
});

io.on("connection", (socket) => {
  console.log("⚡️ User connected:", socket.id);

  // When a client emits "chat:sendMessage", broadcast it:
  socket.on("chat:sendMessage", (msg) => {
    console.log("📨 chat:sendMessage:", msg);
    io.emit("chat:receiveMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// 4) START THE SERVER
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
