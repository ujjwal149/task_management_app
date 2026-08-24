import { useTaskStore } from "@/store/task.store";
import { useNotificationStore } from "@/store/notification.store";

let socket: WebSocket | null = null;

let connectionId = 0;

// Currently joined project room
let currentProjectId: string | null = null;

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
  const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ||
  (window.location.protocol === "https:"
    ? `wss://${window.location.host}/ws`
    : "ws://localhost:5000");

const ws = new WebSocket(WS_URL);



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
        
        case "project:joined":

          console.log(
            `✅ Joined project room: ${message.projectId}`
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

        case "notification:project-invitation": {

          const data = message.data;
                
          console.log(
            "🔔 Project invitation received:",
            data
          );
        
          useNotificationStore
            .getState()
            .addNotification({
              id: crypto.randomUUID(),
            
              type: "PROJECT_INVITATION",
            
              message:
                `${data.invitedBy.name} invited you to join ${data.projectName}`,
            
              data,
            
              read: false,
            
              createdAt:
                new Date().toISOString(),
            });
          
          break;
        }
          

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

  socket = null;

  // Reset current room
  currentProjectId = null;

  if (
    ws.readyState === WebSocket.OPEN ||
    ws.readyState === WebSocket.CONNECTING
  ) {

    ws.close();

  }

};

//-----------------Join Project------------------//
export const joinProject = (
  projectId: string
) => {

  if (!socket) {
    console.error(
      "❌ Cannot join project. WebSocket does not exist."
    );

    return;
  }

  const sendJoinMessage = () => {

    
  //Leave previous project room
    if (
      currentProjectId &&
      currentProjectId !== projectId
    ) {

      const leaveMessage = JSON.stringify({
        event: "project:leave",
        data: {
          projectId: currentProjectId,
        },
      });

      socket?.send(leaveMessage);

      console.log(
        `📤 Leaving previous project room: ${currentProjectId}`
      );

      currentProjectId = null;
    }


  // Join new project room
    const joinMessage = JSON.stringify({
      event: "project:join",
      data: {
        projectId,
      },
    });

    socket?.send(joinMessage);

    console.log(
      `📤 Joining project room: ${projectId}`
    );

    currentProjectId = projectId;
  };


  // WebSocket already connected
  if (
    socket.readyState === WebSocket.OPEN
  ) {

    sendJoinMessage();

    return;
  }

  // WebSocket still connecting

  if (
    socket.readyState === WebSocket.CONNECTING
  ) {

    console.log(
      `⏳ Waiting for WebSocket connection before joining project: ${projectId}`
    );

    socket.addEventListener(
      "open",
      sendJoinMessage,
      {
        once: true,
      }
    );

    return;
  }


  console.error(
    "❌ Cannot join project. WebSocket is not open."
  );
};

//----------Leave Project---------------------------//
export const leaveProject = (
  projectId: string
) => {

  if (
    !socket ||
    socket.readyState !== WebSocket.OPEN
  ) {

    console.error(
      "❌ Cannot leave project. WebSocket is not connected."
    );

    return;
  }


  const message = JSON.stringify({
    event: "project:leave",
    data: {
      projectId,
    },
  });


  socket.send(message);


  console.log(
    `📤 Leaving project room: ${projectId}`
  );


  if (currentProjectId === projectId) {
    currentProjectId = null;
  }
};