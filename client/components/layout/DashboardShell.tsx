import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

type DashboardShellProps = {
  children: React.ReactNode;
};

export default function DashboardShell({
  children,
}: DashboardShellProps) {
  return (
    <div className="flex h-screen bg-stone-100 overflow-hidden">

      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">

        <Navbar />

        <main className="flex-1 overflow-y-auto  p-8">

          {children}

        </main>

      </div>

    </div>
  );
}