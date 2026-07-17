import { create } from "zustand";
import { Task } from "@/types/task.types";

type UIState = {
  sidebarOpen: boolean;

  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;

  taskModalOpen: boolean;

  selectedTask?: Task;

  openCreateTaskModal: () => void;

  openEditTaskModal: (task: Task) => void;

  closeTaskModal: () => void;

  deleteTaskModalOpen: boolean;

  selectedDeleteTask?: Task;

  openDeleteTaskModal: (task: Task) => void;

  closeDeleteTaskModal: () => void;




};

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,

  openSidebar: () =>
    set({
      sidebarOpen: true,
    }),

  closeSidebar: () =>
    set({
      sidebarOpen: false,
    }),

  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  taskModalOpen: false,

  selectedTask: undefined,

  openCreateTaskModal: () =>
    set({
      taskModalOpen: true,
      selectedTask: undefined,
    }),

  openEditTaskModal: (task) =>
    set({
      taskModalOpen: true,
      selectedTask: task,
    }),

  closeTaskModal: () =>
    set({
      taskModalOpen: false,
      selectedTask: undefined,
    }),
  
      deleteTaskModalOpen: false,
  
      selectedDeleteTask: undefined,
  openDeleteTaskModal: (task) =>
    set({
      deleteTaskModalOpen: true,
      selectedDeleteTask: task,
    }),
  
  closeDeleteTaskModal: () =>
    set({
      deleteTaskModalOpen: false,
      selectedDeleteTask: undefined,
    }),
}));