"use client";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import TaskModal from "../task/TaskModal";

import { useUIStore } from "@/store/ui.store";

type DashboardShellProps = {
  children: React.ReactNode;
};

export default function DashboardShell({
  children,
}: DashboardShellProps) {

  const {
    taskModalOpen,
    selectedTask,
    closeTaskModal,
  } = useUIStore();

  return (
    <div className="flex h-screen overflow-hidden bg-stone-100">

      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">

        <Navbar />

        <main className="flex-1 overflow-y-auto p-8">

          {children}

        </main>

        <TaskModal
          open={taskModalOpen}
          task={selectedTask}
          onClose={closeTaskModal}
        />

      </div>

    </div>
  );
}