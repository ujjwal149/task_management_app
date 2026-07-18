"use client";

import { useEffect } from "react";

import { useTasks } from "@/hooks/useTasks";
import TaskCard from "./TaskCard";

export default function TaskList() {

  const {
    tasks,
    loading,
    fetchTasks,
    searchQuery,
  } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (loading) {
  return (
    <p className="text-center text-stone-500">
      Loading tasks...
    </p>
  );
}

  const filteredTasks = tasks.filter((task) => {
  const query = searchQuery.toLowerCase();

  return (
    task.title.toLowerCase().includes(query) ||
    task.description?.toLowerCase().includes(query)
    );
  });

  if (!loading && filteredTasks.length === 0) {
  return (
    <div className="rounded-xl border border-dashed border-stone-300 p-10 text-center">
      <h2 className="text-lg font-semibold">
        No tasks found
      </h2>

      <p className="mt-2 text-stone-500">
        Try a different search keyword.
      </p>
    </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

      {filteredTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
        />
      ))}

    </div>
  );
}``