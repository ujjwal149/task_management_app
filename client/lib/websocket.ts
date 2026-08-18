import { useTaskStore } from "@/store/task.store";

let socket: WebSocket | null = null;

let connectionId = 0;

export const connectWebSocket = () => {
  connectionId++;

  const id = connectionId;

  console.log(
    `🔵 connectWebSocket() called. Connection #${id}`
  );

  // Already connected
  if (socket?.readyState === WebSocket.OPEN) {
    console.log(
      `♻️ Reusing open WebSocket. Connection #${id}`
    );

    return socket;
  }

  // Already connecting
  if (socket?.readyState === WebSocket.CONNECTING) {
    console.log(
      `⏳ WebSocket already connecting. Connection #${id}`
    );

    return socket;
  }

  // Create a new socket
  const ws = new WebSocket("ws://localhost:5000");

  socket = ws;

  ws.onopen = () => {
    console.log(
      `🟢 WebSocket connected. Connection #${id}`
    );
  };

  ws.onmessage = (event) => {
    console.log(
      `📩 WebSocket message. Connection #${id}:`,
      event.data
    );

    try {
      const message = JSON.parse(event.data);

      console.log(
        "🔎 WebSocket event:",
        message.event
      );

      switch (message.event) {

        case "connection:success":

          console.log(
            "✅ WebSocket connection established"
          );

          break;


        case "task:created":

          useTaskStore
            .getState()
            .addTask(message.data.task);

          console.log(
            "✅ Task added from WebSocket"
          );

          break;


        case "task:updated":

          useTaskStore
            .getState()
            .updateTask(message.data.task);

          console.log(
            "✏️ Task updated from WebSocket"
          );

          break;


        case "task:deleted":

          useTaskStore
            .getState()
            .removeTask(
              message.data.taskId
            );

          console.log(
            "🗑️ Task removed from WebSocket"
          );

          break;


        default:

          console.log(
            "ℹ️ Unknown WebSocket event:",
            message.event
          );
      }

    } catch (error) {

      console.error(
        "❌ Failed to parse WebSocket message:",
        error
      );

    }
  };


  ws.onerror = (error) => {

    console.error(
      `🔴 WebSocket error. Connection #${id}:`,
      {
        readyState: ws.readyState,
        url: ws.url,
      }
    );

  };  


  ws.onclose = (event) => {

    console.log(
      `🟡 WebSocket disconnected. Connection #${id}`,
      {
        code: event.code ,
        reson: event.reason,
        wasClean: event.wasClean,
      }
    );

    // Only clear the global reference
    // if this is still the active socket.
    if (socket === ws) {
      socket = null;
    }

  };


  return ws;
};


export const sendWebSocketMessage = (
  message: string
) => {

  if (
    !socket ||
    socket.readyState !== WebSocket.OPEN
  ) {

    console.error(
      "WebSocket is not connected"
    );

    return;
  }

  socket.send(message);

  console.log(
    "📤 Message sent:",
    message
  );
};


export const disconnectWebSocket = () => {

  if (!socket) {
    return;
  }

  const ws = socket;

  console.log(
    `🔌 Disconnecting WebSocket. State: ${ws.readyState}`
  );

  // Clear our reference immediately.
  socket = null;

  // Close OPEN or CONNECTING sockets.
  if (
    ws.readyState === WebSocket.OPEN ||
    ws.readyState === WebSocket.CONNECTING
  ) {

    ws.close();

  }

};