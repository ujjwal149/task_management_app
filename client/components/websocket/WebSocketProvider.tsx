"use client";

import { useEffect } from "react";

import {
  connectWebSocket,
  disconnectWebSocket,
} from "@/lib/websocket";

type WebSocketProviderProps = {
  children: React.ReactNode;
};

export default function WebSocketProvider({
  children,
}: WebSocketProviderProps) {

  useEffect(() => {
    console.log("🟢 WebSocketProvider mounted");
    
    connectWebSocket();
    
    return () => {
      console.log("🔴 WebSocketProvider cleanup");
    
      disconnectWebSocket();
    };
  }, []);

  return <>{children}</>;
}