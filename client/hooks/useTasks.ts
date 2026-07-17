"use client";

import { useTaskStore } from "@/store/task.store";

export function useTasks() {
  return useTaskStore();
}