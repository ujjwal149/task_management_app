import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

type DashboardShellProps = {
  children: React.ReactNode;
};

export default function DashboardShell({
  children,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-stone-100">

      <Sidebar />

      <div className="flex flex-1 flex-col">

        <Navbar />

        <main className="flex-1 p-8">

          {children}

        </main>

      </div>

    </div>
  );
}