import { create } from "zustand";

import { Task } from "@/types/task.types";
import { getMyTasks } from "@/services/task.service";

type TaskStore = {
  // Task State
  tasks: Task[];
  loading: boolean;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Pagination
  page: number;
  limit: number;
  total: number;
  totalPages: number;

  setPage: (page: number) => void;

  // Actions
  fetchTasks: () => Promise<void>;

  setTasks: (tasks: Task[]) => void;

  addTask: (task: Task) => void;

  updateTask: (task: Task) => void;

  removeTask: (taskId: string) => void;

  clearTasks: () => void;
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  // -------------------------
  // Initial State
  // -------------------------

  tasks: [],

  loading: false,

  searchQuery: "",

  page: 1,

  limit: 9,

  total: 0,

  totalPages: 1,

  // -------------------------
  // Search
  // -------------------------

  setSearchQuery: (query) =>
    set({
      searchQuery: query,
    }),

  // -------------------------
  // Pagination
  // -------------------------

  setPage: (page) =>
    set({
      page,
    }),

  // -------------------------
  // Fetch Tasks
  // -------------------------

  fetchTasks: async () => {
    set({
      loading: true,
    });

    try {
      const { page, limit } = get();

      const data = await getMyTasks(page, limit);

      set({
        tasks: data.tasks,

        page: data.page,

        limit: data.limit,

        total: data.total,

        totalPages: data.totalPages,
      });
    } catch (error) {
      console.error(error);
    } finally {
      set({
        loading: false,
      });
    }
  },

  // -------------------------
  // CRUD Operations
  // -------------------------

  setTasks: (tasks) =>
    set({
      tasks,
    }),

  addTask: (task) =>
    set((state) => ({
      tasks: [task, ...state.tasks],
    })),

  updateTask: (updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    })),

  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter(
        (task) => task.id !== taskId
      ),
    })),

  clearTasks: () =>
    set({
      tasks: [],

      loading: false,

      searchQuery: "",

      page: 1,

      limit: 9,

      total: 0,

      totalPages: 1,
    }),
}));