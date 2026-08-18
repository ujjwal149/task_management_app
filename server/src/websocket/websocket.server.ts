  import {
    WebSocketServer,
    WebSocket,
  } from "ws";

  import prisma from "../lib/prisma";

  import { Server } from "http";

  import { verifyToken } from "../lib/jwt";

  import { WS_EVENTS } from "./events";


  const userConnections = new Map<
      string,
      Set<WebSocket>
    >();

  const removeConnection = (
          userId: string,
          ws: WebSocket
        ) => {
          const connections = userConnections.get(userId);
        
          if (!connections) {
            return;
          }
        
          connections.delete(ws);
        
          if (connections.size === 0) {
            userConnections.delete(userId);
          }
        };
  export const initializeWebSocket = (
    server: Server
  ) => {

    const wss = new WebSocketServer({
      server,
    });


    console.log(
      "WebSocket server initialized."
    );


    wss.on(
      "connection",
      (ws, request) => {

        try {

          // ============================================
          // GET COOKIE
          // ============================================

          const cookieHeader =
            request.headers.cookie;


          if (!cookieHeader) {

            console.log(
              "❌ WebSocket rejected: No cookies"
            );

            ws.close();

            return;
          }


          // ============================================
          // EXTRACT JWT
          // ============================================

          const token = cookieHeader
            .split(";")
            .find((cookie) => cookie.trim().startsWith("token="))
            ?.trim()
            .slice("token=".length);


          if (!token) {

            console.log(
              "❌ WebSocket rejected: No token"
            );

            ws.close();

            return;
          }

          // VERIFY JWT
    

          const decoded = verifyToken(token);


          console.log(
            "👤 WebSocket authenticated:",
            decoded.userId
          );


          console.log(
            "🔐 User role:",
            decoded.role
          );


          // STORE CONNECTION


          if(!userConnections.has(decoded.userId)){
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


          // CONNECTION SUCCESS


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

          // CLIENT MESSAGE

          ws.on("message", (message) => {

            console.log(
              "📩 Client message:",
              message.toString()
            );


            broadcast(
              WS_EVENTS.TEST_BROADCAST,
              {
                message:
                  message.toString(),
              }
            );

          });


          
          // DISCONNECT

          ws.on("close", () => {
            console.log(
              "🔴 WebSocket client disconnected:",
              decoded.userId
            );
          
            removeConnection(decoded.userId, ws);
          });

          // ERROR
          ws.on("error", (error) => {
            console.error(
              "🔴 WebSocket error:",
              error
            );
          
            removeConnection(decoded.userId, ws);
          });

          
        

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



  //--------------- BROADCAST----------//

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

        connections.forEach((client) => {

          if (
            client.readyState ===
            WebSocket.OPEN
          ) {
            client.send(message);
          }

        });

      }
    );
  };

  //--------------sendToUser--------------//
  export const sendToUser = (
    userId: string,
    event: string,
    data: unknown
  ) => {
    const connections = userConnections.get(userId);

    if(!connections){
      console.log(
        `⚠️ No active websocket connection for user: ${userId}`
      );

      return;
    }
    const message = JSON.stringify({
      event,
      data,
    });

    connections.forEach((client) => {
      if (client.readyState === WebSocket.OPEN){
        client.send(message)
      }
    });

    console.log(
      `📤 WebSocket event sent to user ${userId}: ${event}`
    );
  };

  //--------------sendToProjectId--------------//
  export const sendToProjectId = async(
    projectId: string,
    event: string,
    data: unknown,
  ) =>{
    const projectMembers = await prisma.projectMember.findMany({
      where:{
        projectId,
      },
      select:{
        userId:true,
      },
    });

    //No memebers
    if(projectMembers.length === 0){
      console.log(
        `⚠️ No memebers found for project: ${projectId}`
      );
      return;
    }

    const message = JSON.stringify({
      event,
      data,
    });

    //Send to every project memeber
    projectMembers.forEach(({userId}) =>{

      const connections =
        userConnections.get(userId);

      //User is a project memeber 
      //but currently has no websocket connection . 

      if(!connections){
        console.log(
          `⚠️ User ${userId} has no active WebSocket connection`
      );
      return;
      }

      connections.forEach((client) => {

        if(client.readyState === WebSocket.OPEN){
          client.send(message);
        }
        
      });
    });
    console.log(
      `📤 WebSocket event sent to project ${projectId}: ${event}`
  );


  }