import app from "./app";
import http from "http";
import { initializeWebSocket } from "./websocket/websocket.server";
import dotenv from "dotenv";

dotenv.config();

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

initializeWebSocket(server);

server.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );

  console.log(
    `WebSocket running on ws://localhost:${PORT}`
  );
});