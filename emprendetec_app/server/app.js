import { createServer } from "http";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import setupRoutes from "./routes/routes.js";
import { Server } from "socket.io";
import { verifySocketToken } from "./sessions/session-provider.js";
// CLIENT FILES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CLIENT_FILES = path.join(__dirname, "../client/dist/");

// PORT
const PORT = process.env.PORT || 1234; // Azure will use process.env.PORT

// SERVER
const app = express();
app.use(express.json()); // Parse JSON bodies
app.disable("x-powered-by"); // Don't advertise the server engine
app.set("port", PORT);

// HTTP SERVER
const server = createServer(app);
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});
io.use(verifySocketToken);

// Mapa de usuarios online
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} added with socket ${socket.id}`);
  });

  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("getMessage", { senderId, message });
      console.log(`Message from ${senderId} to ${receiverId}: ${message}`);
    } else {
      console.log(`Receiver ${receiverId} not found`);
    }
  });

  socket.on("disconnect", () => {
    const userId = getKeyByValue(onlineUsers, socket.id);
    onlineUsers.delete(userId);
    console.log(`User ${userId} disconnected`);
  });
});

function getKeyByValue(map, searchValue) {
  for (let [key, value] of map.entries()) {
    if (value === searchValue) return key;
  }
  return null;
}

// HELLO WORLD
app.get("/api", (req, res) => {
  res.json({ message: "Hello, World!" });
});

// ROUTERS
setupRoutes(app);

// STATIC FILES (REACT)
app.use(express.static(CLIENT_FILES));
app.get("*", (req, res) => {
  res.sendFile(path.join(CLIENT_FILES, "index.html"));
});
