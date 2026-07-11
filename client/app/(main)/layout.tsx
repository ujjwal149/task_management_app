import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardShell from "@/components/layout/DashboardShell";

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