"use client";

import { useEffect } from "react";

import {
  connectWebSocket,
  disconnectWebSocket,
  joinProject,
} from "@/lib/websocket";

import { useProjectStore } from "@/store/project.store";

type WebSocketProviderProps = {
  children: React.ReactNode;
};

export default function WebSocketProvider({
  children,
}: WebSocketProviderProps) {

  const currentProject =
    useProjectStore(
      (state) => state.currentProject
    );

//-------------Connect WebSocket------------------//
  useEffect(() => {

    console.log(
      "🟢 WebSocketProvider mounted"
    );

    connectWebSocket();

    return () => {

      console.log(
        "🔴 WebSocketProvider cleanup"
      );

      disconnectWebSocket();

    };

  }, []);


//-------------Join Current Project--------------------//

  useEffect(() => {

    if (!currentProject?.id) {

      console.log(
        "ℹ️ No current project selected"
      );

      return;
    }


    console.log(
      "📁 Current project changed:",
      currentProject.id
    );


    joinProject(
      currentProject.id
    );


  }, [currentProject?.id]);


  return <>{children}</>;
}