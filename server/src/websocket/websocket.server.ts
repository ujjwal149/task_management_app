import {
  WebSocketServer,
  WebSocket,
} from "ws";

import prisma from "../lib/prisma";

import { Server } from "http";

import { verifyToken } from "../lib/jwt";

import { WS_EVENTS } from "./events";


//CONNECTION STORAGE
const userConnections = new Map<
  string,
  Set<WebSocket>
>();

// Project rooms
const projectRooms = new Map<
  string,
  Set<WebSocket>
>();


// Which projects does each WebSocket belong to?
const socketProjects = new Map<
  WebSocket,
  Set<string>
>();


// USER CONNECTION CLEANUP
const removeConnection = (
  userId: string,
  ws: WebSocket
) => {

  const connections =
    userConnections.get(userId);

  if (!connections) {
    return;
  }

  connections.delete(ws);

  if (connections.size === 0) {
    userConnections.delete(userId);
  }
};


//----------JOIN PROJECT ROOM-------------//
const joinProjectRoom = (
  projectId: string,
  ws: WebSocket
) => {

  // Create room if it doesn't exist

  if (!projectRooms.has(projectId)) {

    projectRooms.set(
      projectId,
      new Set()
    );

  }


  // Add WebSocket to room

  projectRooms
    .get(projectId)!
    .add(ws);


  console.log(
    `🟢 WebSocket joined project room: ${projectId}`
  );
};


//---------LEAVE PROJECT ROOM-------------//
const leaveProjectRoom = (
  projectId: string,
  ws: WebSocket
) => {

  const connections =
    projectRooms.get(projectId);

  if (!connections) {
    return;
  }


  // Remove socket from room

  connections.delete(ws);


  // Delete empty room

  if (connections.size === 0) {

    projectRooms.delete(projectId);

  }


  console.log(
    `🔴 WebSocket left project room: ${projectId}`
  );
};


// Initialize Websocket
export const initializeWebSocket = (
  server: Server
) => {

  const wss =
    new WebSocketServer({
      server,
    });


  console.log(
    "WebSocket server initialized."
  );


  // ==========================================================
  // NEW CONNECTION
  // ==========================================================

  wss.on(
    "connection",
    (ws, request) => {

      try {

        // ====================================================
        // GET COOKIE
        // ====================================================

        const cookieHeader =
          request.headers.cookie;


        if (!cookieHeader) {

          console.log(
            "❌ WebSocket rejected: No cookies"
          );

          ws.close();

          return;
        }


        // ====================================================
        // EXTRACT JWT
        // ====================================================

        const token =
          cookieHeader
            .split(";")
            .find(
              (cookie) =>
                cookie
                  .trim()
                  .startsWith("token=")
            )
            ?.trim()
            .slice("token=".length);


        if (!token) {

          console.log(
            "❌ WebSocket rejected: No token"
          );

          ws.close();

          return;
        }


        // ====================================================
        // VERIFY JWT
        // ====================================================

        const decoded =
          verifyToken(token);


        console.log(
          "👤 WebSocket authenticated:",
          decoded.userId
        );


        console.log(
          "🔐 User role:",
          decoded.role
        );


        // ====================================================
        // STORE USER CONNECTION
        // ====================================================

        if (
          !userConnections.has(
            decoded.userId
          )
        ) {

          userConnections.set(
            decoded.userId,
            new Set()
          );

        }


        userConnections
          .get(decoded.userId)!
          .add(ws);


        console.log(
          "🟢 New authenticated WebSocket client"
        );


        // ====================================================
        // CONNECTION SUCCESS
        // ====================================================

        ws.send(
          JSON.stringify({

            event:
              WS_EVENTS.CONNECTION_SUCCESS,

            message:
              "Connected to TaskFlow WebSocket server",

            userId:
              decoded.userId,

          })
        );


        // ====================================================
        // CLIENT MESSAGE
        // ====================================================

        ws.on(
          "message",
          async (message) => {

            try {

              const parsedMessage =
                JSON.parse(
                  message.toString()
                );


              console.log(
                "📩 Client message:",
                parsedMessage
              );


              // ==================================================
              // JOIN PROJECT
              // ==================================================

              if (
                parsedMessage.event ===
                WS_EVENTS.JOIN_PROJECT
              ) {

                const {
                  projectId,
                } =
                  parsedMessage.data;


                // ----------------------------------------------
                // Validate projectId
                // ----------------------------------------------

                if (!projectId) {

                  ws.send(
                    JSON.stringify({

                      event:
                        WS_EVENTS.JOIN_PROJECT,

                      error:
                        "projectId is required",

                    })
                  );

                  return;
                }


                // ----------------------------------------------
                // Check project membership
                // ----------------------------------------------

                const membership =
                  await prisma.projectMember.findUnique({

                    where: {

                      userId_projectId: {

                        userId:
                          decoded.userId,

                        projectId,

                      },

                    },

                  });


                // ----------------------------------------------
                // User is NOT a project member
                // ----------------------------------------------

                if (!membership) {

                  console.log(
                    `❌ User ${decoded.userId} is not a member of project ${projectId}`
                  );


                  ws.send(
                    JSON.stringify({

                      event:
                        WS_EVENTS.JOIN_PROJECT,

                      error:
                        "You are not a member of this project.",

                    })
                  );


                  return;
                }


                // ----------------------------------------------
                // User is authorized
                // ----------------------------------------------

                joinProjectRoom(
                  projectId,
                  ws
                );


                // ----------------------------------------------
                // Remember projects for this socket
                // ----------------------------------------------

                if (
                  !socketProjects.has(ws)
                ) {

                  socketProjects.set(
                    ws,
                    new Set()
                  );

                }


                socketProjects
                  .get(ws)!
                  .add(projectId);


                // ----------------------------------------------
                // Tell client
                // ----------------------------------------------

                ws.send(
                  JSON.stringify({

                    event:
                      WS_EVENTS.PROJECT_JOINED,

                    projectId,

                  })
                );


                console.log(
                  `✅ User ${decoded.userId} joined project ${projectId}`
                );


                return;
              }


              // ==================================================
              // LEAVE PROJECT
              // ==================================================

              if (
                parsedMessage.event ===
                WS_EVENTS.LEAVE_PROJECT
              ) {

                const {
                  projectId,
                } =
                  parsedMessage.data;


                if (!projectId) {
                  return;
                }


                // Remove socket from room

                leaveProjectRoom(
                  projectId,
                  ws
                );


                // Remove project from
                // socket's project list

                const projects =
                  socketProjects.get(ws);


                if (projects) {

                  projects.delete(
                    projectId
                  );


                  if (
                    projects.size === 0
                  ) {

                    socketProjects.delete(
                      ws
                    );

                  }

                }


                // Tell client

                ws.send(
                  JSON.stringify({

                    event:
                      WS_EVENTS.PROJECT_LEFT,

                    projectId,

                  })
                );


                console.log(
                  `✅ User ${decoded.userId} left project ${projectId}`
                );


                return;
              }


              // ==================================================
              // UNKNOWN MESSAGE
              // ==================================================

              console.log(
                "ℹ️ Unknown WebSocket event:",
                parsedMessage.event
              );

            } catch (error) {

              console.error(
                "❌ Invalid WebSocket message:",
                error
              );

            }

          }
        );


        // ====================================================
        // DISCONNECT
        // ====================================================

        ws.on(
          "close",
          () => {

            console.log(
              "🔴 WebSocket client disconnected:",
              decoded.userId
            );


            // ----------------------------------------------
            // Remove from user connections
            // ----------------------------------------------

            removeConnection(
              decoded.userId,
              ws
            );


            // ----------------------------------------------
            // Remove from all project rooms
            // ----------------------------------------------

            const projects =
              socketProjects.get(ws);


            if (projects) {

              projects.forEach(
                (projectId) => {

                  leaveProjectRoom(
                    projectId,
                    ws
                  );

                }
              );


              socketProjects.delete(
                ws
              );

            }

          }
        );


        // ====================================================
        // ERROR
        // ====================================================

        ws.on(
          "error",
          (error) => {

            console.error(
              "🔴 WebSocket error:",
              error
            );

            // User connection cleanup
            removeConnection(
              decoded.userId,
              ws
            );

          }
        );

      } catch (error) {

        console.error(
          "❌ WebSocket authentication failed:",
          error
        );


        ws.close();

      }

    }
  );


  return wss;
};


// Brodcast
export const broadcast = (
  event: string,
  data: unknown
) => {

  const message =
    JSON.stringify({

      event,

      data,

    });


  userConnections.forEach(
    (connections) => {

      connections.forEach(
        (client) => {

          if (
            client.readyState ===
            WebSocket.OPEN
          ) {

            client.send(
              message
            );

          }

        }
      );

    }
  );

};



//-----------Send To User----------------------//
export const sendToUser = (
  userId: string,
  event: string,
  data: unknown
) => {

  const connections =
    userConnections.get(userId);


  if (!connections) {

    console.log(
      `⚠️ No active websocket connection for user: ${userId}`
    );

    return;
  }


  const message =
    JSON.stringify({

      event,

      data,

    });


  connections.forEach(
    (client) => {

      if (
        client.readyState ===
        WebSocket.OPEN
      ) {

        client.send(
          message
        );

      }

    }
  );


  console.log(
    `📤 WebSocket event sent to user ${userId}: ${event}`
  );

};




//--------------sendToProjectRoom--------------//
export const sendToProjectRoom = (
  projectId: string,
  event: string,
  data: unknown
) => {
  const connections = projectRooms.get(projectId);

  // No active connections in this project room
  if (!connections) {
    console.log(
      `⚠️ No active WebSocket connections in project room: ${projectId}`
    );

    return;
  }

  const message = JSON.stringify({
    event,
    data,
  });

  connections.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });

  console.log(
    `📤 WebSocket event sent to project room ${projectId}: ${event}`
  );
};