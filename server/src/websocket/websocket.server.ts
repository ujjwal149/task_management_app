import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";

import prisma from "../lib/prisma";
import { verifyToken } from "../lib/jwt";
import { WS_EVENTS } from "./events";

// Authenticated connections eligible to receive broadcasts.
const userConnections = new Map<string, Set<WebSocket>>();

// Connections waiting for the database authentication check.
const authenticatingConnections = new Map<string, Set<WebSocket>>();

// Project subscriptions.
const projectRooms = new Map<string, Set<WebSocket>>();
const socketProjects = new Map<WebSocket, Set<string>>();

// Remove a socket from either user connection map.
const removeFromConnectionMap = (
  connectionsMap: Map<string, Set<WebSocket>>,
  userId: string,
  ws: WebSocket
) => {
  const connections = connectionsMap.get(userId);

  if (!connections) {
    return;
  }

  connections.delete(ws);

  if (connections.size === 0) {
    connectionsMap.delete(userId);
  }
};

const joinProjectRoom = (
  projectId: string,
  ws: WebSocket
) => {
  if (!projectRooms.has(projectId)) {
    projectRooms.set(projectId, new Set());
  }

  projectRooms.get(projectId)!.add(ws);

  if (!socketProjects.has(ws)) {
    socketProjects.set(ws, new Set());
  }

  socketProjects.get(ws)!.add(projectId);
};

const leaveProjectRoom = (
  projectId: string,
  ws: WebSocket
) => {
  const connections = projectRooms.get(projectId);

  if (connections) {
    connections.delete(ws);

    if (connections.size === 0) {
      projectRooms.delete(projectId);
    }
  }

  const projects = socketProjects.get(ws);

  if (projects) {
    projects.delete(projectId);

    if (projects.size === 0) {
      socketProjects.delete(ws);
    }
  }
};

// Safe to call more than once for the same socket.
const cleanupSocket = (
  userId: string,
  ws: WebSocket
) => {
  removeFromConnectionMap(userConnections, userId, ws);
  removeFromConnectionMap(
    authenticatingConnections,
    userId,
    ws
  );

  const projects = socketProjects.get(ws);

  if (projects) {
    for (const projectId of Array.from(projects)) {
      leaveProjectRoom(projectId, ws);
    }
  }

  socketProjects.delete(ws);
};

export const initializeWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server });

  console.log("WebSocket server initialized.");

  wss.on("connection", async (ws, request) => {
    let userId: string | undefined;

    // Install cleanup before any asynchronous authentication work.
    ws.on("close", () => {
      if (userId) {
        cleanupSocket(userId, ws);
      }
    });

    ws.on("error", () => {
      console.error("WebSocket connection error.");

      if (userId) {
        cleanupSocket(userId, ws);
      }

      ws.terminate();
    });

    try {
      const cookieHeader = request.headers.cookie;

      const token = cookieHeader
        ?.split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith("token="))
        ?.slice("token=".length);

      if (!token) {
        ws.close(1008, "Authentication required");
        return;
      }

      const decoded = verifyToken(token);

      if (
        !decoded ||
        typeof decoded.userId !== "string" ||
        decoded.userId.length === 0 ||
        !Number.isInteger(decoded.tokenVersion) ||
        decoded.tokenVersion < 0
      ) {
        ws.close(1008, "Invalid session");
        return;
      }

      userId = decoded.userId;

      // Track the socket before awaiting the database.
      // Password reset can now close it even during authentication.
      if (!authenticatingConnections.has(userId)) {
        authenticatingConnections.set(userId, new Set());
      }

      authenticatingConnections.get(userId)!.add(ws);

      try {
        const currentUser = await prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            id: true,
            tokenVersion: true,
          },
        });

        if (
          !currentUser ||
          currentUser.tokenVersion !== decoded.tokenVersion
        ) {
          ws.close(1008, "Session expired");
          return;
        }

        // A reset or client disconnect may have closed this socket
        // while the database query was running.
        if (ws.readyState !== WebSocket.OPEN) {
          return;
        }
      } finally {
        removeFromConnectionMap(
          authenticatingConnections,
          userId,
          ws
        );
      }

      // No await between authentication and registration.
      if (!userConnections.has(userId)) {
        userConnections.set(userId, new Set());
      }

      userConnections.get(userId)!.add(ws);

      ws.on("message", async (message) => {
        if (ws.readyState !== WebSocket.OPEN) {
          return;
        }

        try {
          const parsedMessage = JSON.parse(message.toString());

          if (
            !parsedMessage ||
            typeof parsedMessage !== "object"
          ) {
            return;
          }

          // Join a project room.
          if (
            parsedMessage.event === WS_EVENTS.JOIN_PROJECT
          ) {
            const projectId = parsedMessage.data?.projectId;

            if (
              typeof projectId !== "string" ||
              projectId.trim().length === 0
            ) {
              ws.send(
                JSON.stringify({
                  event: WS_EVENTS.JOIN_PROJECT,
                  error: "projectId is required",
                })
              );

              return;
            }

            const membership =
              await prisma.projectMember.findUnique({
                where: {
                  userId_projectId: {
                    userId: decoded.userId,
                    projectId,
                  },
                },
              });

            // Do not rejoin rooms after a password reset closes
            // the socket during the membership query.
            if (ws.readyState !== WebSocket.OPEN) {
              return;
            }

            if (!membership) {
              ws.send(
                JSON.stringify({
                  event: WS_EVENTS.JOIN_PROJECT,
                  error:
                    "You are not a member of this project.",
                })
              );

              return;
            }

            joinProjectRoom(projectId, ws);

            ws.send(
              JSON.stringify({
                event: WS_EVENTS.PROJECT_JOINED,
                projectId,
              })
            );

            return;
          }

          // Leave a project room.
          if (
            parsedMessage.event === WS_EVENTS.LEAVE_PROJECT
          ) {
            const projectId = parsedMessage.data?.projectId;

            if (
              typeof projectId !== "string" ||
              projectId.trim().length === 0
            ) {
              return;
            }

            leaveProjectRoom(projectId, ws);

            ws.send(
              JSON.stringify({
                event: WS_EVENTS.PROJECT_LEFT,
                projectId,
              })
            );

            return;
          }
        } catch {
          console.error("Unable to process WebSocket message.");
        }
      });

      ws.send(
        JSON.stringify({
          event: WS_EVENTS.CONNECTION_SUCCESS,
          message: "Connected to TaskFlow WebSocket server",
          userId,
        })
      );
    } catch {
      console.error("WebSocket authentication failed.");

      if (userId) {
        cleanupSocket(userId, ws);
      }

      ws.close(1008, "Unable to authenticate session");
    }
  });

  return wss;
};

// Called after a successful password-reset transaction commits.
export const disconnectUserSockets = (userId: string) => {
  const connections = new Set<WebSocket>([
    ...(userConnections.get(userId) ?? []),
    ...(authenticatingConnections.get(userId) ?? []),
  ]);

  for (const ws of connections) {
    // Remove access to broadcasts immediately.
    cleanupSocket(userId, ws);

    ws.close(
      1008,
      "Session expired. Please sign in again."
    );
  }
};

// Broadcast to all authenticated connections.
export const broadcast = (
  event: string,
  data: unknown
) => {
  const message = JSON.stringify({ event, data });

  for (const connections of userConnections.values()) {
    for (const client of connections) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }
};

// Send an event to one user's authenticated connections.
export const sendToUser = (
  userId: string,
  event: string,
  data: unknown
) => {
  const connections = userConnections.get(userId);

  if (!connections) {
    return;
  }

  const message = JSON.stringify({ event, data });

  for (const client of connections) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
};

// Send an event to authenticated project subscribers.
export const sendToProjectRoom = (
  projectId: string,
  event: string,
  data: unknown
) => {
  const connections = projectRooms.get(projectId);

  if (!connections) {
    return;
  }

  const message = JSON.stringify({ event, data });

  for (const client of connections) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
};