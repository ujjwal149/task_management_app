import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardShell from "@/components/layout/DashboardShell";
import WebSocketProvider from "@/components/websocket/WebSocketProvider";

import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <WebSocketProvider>
        <DashboardShell>
          {children}
        </DashboardShell>
      </WebSocketProvider>
    </ProtectedRoute>
  );
}