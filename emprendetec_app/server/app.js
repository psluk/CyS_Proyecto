import { createServer } from "http";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import setupRoutes from "./routes/routes.js";

// CLIENT FILES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CLIENT_FILES = path.join(__dirname, "../client/");

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
