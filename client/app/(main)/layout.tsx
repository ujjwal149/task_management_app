import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardShell from "@/components/layout/DashboardShell";

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
      <DashboardShell>
        {children}
      </DashboardShell>
    </ProtectedRoute>
  );
}