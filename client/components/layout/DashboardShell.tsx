"use client";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import TaskModal from "../task/TaskModal";

import { useUIStore } from "@/store/ui.store";

import DeleteTaskModal from "../task/DeleteTaskModal";
import FloatingActionButton from "@/components/layout/FloatingActionButton";

import { deleteTask } from "@/services/task.service";
import { useTaskStore } from "@/store/task.store";
import toast from "react-hot-toast";

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

    deleteTaskModalOpen,
    selectedDeleteTask,
    closeDeleteTaskModal,
  } = useUIStore();

  const removeTask =
  useTaskStore((state) => state.removeTask);

  const handleDeleteTask = async () => {
  if (!selectedDeleteTask) return;

  try {

    await deleteTask(selectedDeleteTask.id);

    removeTask(selectedDeleteTask.id);

    toast.success("Task deleted");

    closeDeleteTaskModal();

  } catch (error) {

    toast.error("Failed to delete task");

  }
};
  return (
    <div className="flex h-screen overflow-hidden bg-stone-100">

      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">

        <Navbar />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-8">

          {children}

        </main>

        <FloatingActionButton/>

        <TaskModal
          open={taskModalOpen}
          task={selectedTask}
          onClose={closeTaskModal}
        />

        <DeleteTaskModal
          open={deleteTaskModalOpen}
          loading={false}
          onClose={closeDeleteTaskModal}
          onConfirm={handleDeleteTask}
        />

      </div>

    </div>
  );
}