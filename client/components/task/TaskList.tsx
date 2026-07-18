"use client";

import { useEffect } from "react";

import { useTasks } from "@/hooks/useTasks";
import TaskCard from "./TaskCard";

export default function TaskList() {

  const {

  tasks,

  loading,

  fetchTasks,

  page,

  totalPages,

  setPage,

  searchQuery,

  } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, [page,fetchTasks]);

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
    <>
  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

    {filteredTasks.map((task) => (
      <TaskCard
        key={task.id}
        task={task}
      />
    ))}

  </div>

  <div className="mt-8 flex items-center justify-center gap-4">

    <button
      disabled={page === 1}
      onClick={() => setPage(page - 1)}
      className="rounded-lg border px-4 py-2 disabled:opacity-50"
    >
      Previous
    </button>

    <span className="font-medium">
      Page {page} of {totalPages}
    </span>

    <button
      disabled={page === totalPages}
      onClick={() => setPage(page + 1)}
      className="rounded-lg border px-4 py-2 disabled:opacity-50"
    >
      Next
    </button>

  </div>
</>
  );
}