"use client";

import { useEffect } from "react";

import { useTasks } from "@/hooks/useTasks";
import TaskCard from "./TaskCard";

export default function TaskList() {

  const {
    tasks,
    loading,
    fetchTasks,
  } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
        />
      ))}

    </div>
  );
}``