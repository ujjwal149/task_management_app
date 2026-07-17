"use client";

import TaskList from "@/components/task/TaskList";

export default function TasksPage() {
  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-stone-900">
            Tasks
          </h1>

          <p className="mt-1 text-stone-500">
            Manage your daily tasks efficiently.
          </p>
        </div>

      </div>

      <TaskList />

    </div>
  );
}