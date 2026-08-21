"use client";

import { CalendarDays, Pencil, Trash2, FolderKanban, } from "lucide-react";

import { Task } from "@/types/task.types";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";

import TaskStatusDropdown from "./TaskStatusDropdown";

type Props = {
  task: Task;
};

export default function TaskCard({ task }: Props) {

  const { user } = useAuthStore();

  const isProjectAdmin =
    task.project.creatorId === user?.id;

  const canEditDelete = isProjectAdmin;

  const canChangeStatus =
    isProjectAdmin ||
    task.assignToId === user?.id;

  const {
    openEditTaskModal,
    openDeleteTaskModal,
  } = useUIStore();

  // ...

  return (
    <div
      className=" rounded-2xl border border-stone-200 bg-white p-6 
                shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      >

      {/* Project */}

      <div className="mb-4 flex items-center gap-2">

        <div
          className="h-3 w-3 rounded-full"
          style={{
            backgroundColor:
              task.project?.color || "#2563EB",
          }}
        />

        <FolderKanban
          size={16}
          className="text-stone-500"
        />

        <span className="text-sm font-medium text-stone-600">
        
          {task.project?.name}
        
        </span>
        
      </div>
        
      {/* Header */}

      <div className="flex items-center justify-between">

        <h2 className="text-lg font-semibold text-stone-900">
          {task.title}
        </h2>

        <div className="flex items-center gap-3">

          <span
            className={`
              rounded-full
              px-3
              py-1
              text-xs
              font-semibold
            
              ${
                task.priority === "HIGH"
                  ? "bg-red-100 text-red-700"
              
                  : task.priority === "MEDIUM"
                  ? "bg-yellow-100 text-yellow-700"
              
                  : "bg-green-100 text-green-700"
              }
            `}
          >

            {task.priority}
            
          </span>
{canEditDelete && (
  <>
    <button
      type="button"
      onClick={() => openEditTaskModal(task)}
      className="rounded-lg p-2 text-stone-500 transition hover:bg-stone-100 hover:text-blue-600"
      title="Edit Task"
    >
      <Pencil size={18} />
    </button>

    <button
      type="button"
      onClick={() => openDeleteTaskModal(task)}
      className="rounded-lg p-2 text-stone-500 transition hover:bg-red-100 hover:text-red-600"
      title="Delete Task"
    >
      <Trash2 size={18} />
    </button>
  </>
)}
</div>
      </div>

      {/* Description */}

      <p className="mt-4 text-sm text-stone-600">
        {task.description || "No description"}
      </p>

      {/* Assignee */}
      
      <div className="mt-5 flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-stone-200">

          {task.assignTo?.avatar ? (
            <img
              src={task.assignTo.avatar}
              alt={task.assignTo.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-stone-600">
              {task.assignTo?.name?.charAt(0).toUpperCase() || "?"}
            </span>
          )}

        </div>
        
        <div>
          <p className="text-xs text-stone-500">
            Assigned to
          </p>
        
          <p className="text-sm font-medium text-stone-800">
            {task.assignTo?.name || "Unassigned"}
          </p>
        </div>
        
      </div>

      {/* Footer */}

      <div className="mt-6 flex items-center justify-between">

        <TaskStatusDropdown
          taskId={task.id}
          status={task.status}
          canChangeStatus={canChangeStatus}
        />

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