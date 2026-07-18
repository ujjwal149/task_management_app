import { create } from "zustand";

import {
  Task,
} from "@/types/task.types";

import {
  getMyTasks,
} from "@/services/task.service";

type TaskStore = {
  tasks: Task[];

  loading: boolean;

  searchQuery: string;

  setSearchQuery: (query: string) => void;  

  fetchTasks: () => Promise<void>;

  setTasks: (tasks: Task[]) => void;

  addTask: (task: Task) => void;

  updateTask: (task: Task) => void;

  removeTask: (taskId: string) => void;

  clearTasks: () => void;
};

export const useTaskStore = create<TaskStore>((set) => ({

  tasks: [],

  loading: false,

  searchQuery: "",

  setSearchQuery: (query) =>
    set({
      searchQuery: query,
    }),

  fetchTasks: async () => {

    set({
      loading: true,
    });

    try {

      const data = await getMyTasks();

      set({
        tasks: data.tasks,
      });

    } catch (error) {

      console.error(error);

    } finally {

      set({
        loading: false,
      });

    }

  },

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
        task.id === updatedTask.id
          ? updatedTask
          : task
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
    }),

}));

