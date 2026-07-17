"use client";

import { CalendarDays, Pencil } from "lucide-react";

import { Task } from "@/types/task.types";
import { useUIStore } from "@/store/ui.store";

type Props = {
  task: Task;
};

export default function TaskCard({
  task,
}: Props) {

  const { openEditTaskModal } = useUIStore();

  return (
    <div
      className="
        rounded-2xl
        border
        border-stone-200
        bg-white
        p-6
        shadow-sm
        transition
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between">

        <h2 className="text-lg font-semibold text-stone-900">
          {task.title}
        </h2>

        <div className="flex items-center gap-3">

          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            {task.priority}
          </span>

          <button
            type="button"
            onClick={() => openEditTaskModal(task)}
            className="rounded-lg p-2 text-stone-500 transition hover:bg-stone-100 hover:text-blue-600"
            title="Edit Task"
          >
            <Pencil size={18} />
          </button>

        </div>

      </div>

      {/* Description */}

      <p className="mt-4 text-sm text-stone-600">
        {task.description || "No description"}
      </p>

      {/* Footer */}

      <div className="mt-6 flex items-center justify-between">

        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium">
          {task.status}
        </span>

        <div className="flex items-center gap-2 text-sm text-stone-500">

          <CalendarDays size={16} />

          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "No Due Date"}

        </div>

      </div>

    </div>
  );
}