"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { TaskStatus } from "@/types/task.types";
import { updateTaskStatus } from "@/services/task.service";
import { useTaskStore } from "@/store/task.store";

type Props = {
  taskId: string;
  status: TaskStatus;
  canChangeStatus: boolean;
};

const statusOptions: {
  value: TaskStatus;
  label: string;
}[] = [
  {
    value: "TODO",
    label: "Todo",
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
  },
  {
    value: "DONE",
    label: "Done",
  },
];

const getStatusStyle = (status: TaskStatus) => {
  switch (status) {
    case "DONE":
      return "bg-green-100 text-green-700";

    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700";

    default:
      return "bg-stone-200 text-stone-700";
  }
};

export default function TaskStatusDropdown({
  taskId,
  status,
  canChangeStatus,
}: Props) {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const { moveTask, fetchTasks } = useTaskStore();

  const handleStatusChange = async (
    newStatus: TaskStatus
  ) => {
    if (
      !canChangeStatus ||
      updating ||
      newStatus === status
    ) {
      setOpen(false);
      return;
    }

    const previousStatus = status;

    setOpen(false);
    setUpdating(true);

    // Optimistic UI update
    moveTask(taskId, newStatus);

    try {
      await updateTaskStatus(
        taskId,
        newStatus
      );
    } catch (error) {
      console.error(error);

      // Restore server state if request fails
      moveTask(taskId, previousStatus);

      await fetchTasks();
    } finally {
      setUpdating(false);
    }
  };

  if (!canChangeStatus) {
    return (
      <span
        className={`
          rounded-full
          px-3
          py-1
          text-xs
          font-medium
          ${getStatusStyle(status)}
        `}
      >
        {status.replace("_", " ")}
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        disabled={updating}
        onClick={() => setOpen((value) => !value)}
        className={`
          flex
          items-center
          gap-1.5
          rounded-full
          px-3
          py-1
          text-xs
          font-medium
          transition
          hover:opacity-80
          disabled:cursor-not-allowed
          disabled:opacity-50
          ${getStatusStyle(status)}
        `}
      >
        <span>
          {status.replace("_", " ")}
        </span>

        <ChevronDown
          size={14}
          className={`
            transition-transform
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {open && (
        <div
          className="
            absolute
            bottom-full
            left-0
            z-50
            mb-2
            min-w-[150px]
            overflow-hidden
            rounded-xl
            border
            border-stone-200
            bg-white
            p-1
            shadow-lg
          "
        >
          {statusOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={updating}
              onClick={() =>
                handleStatusChange(
                  option.value
                )
              }
              className={`
                flex
                w-full
                items-center
                rounded-lg
                px-3
                py-2
                text-left
                text-sm
                transition
                hover:bg-stone-100
                ${
                  option.value === status
                    ? "font-semibold bg-stone-50"
                    : "text-stone-700"
                }
              `}
            >
              <span
                className={`
                  mr-2
                  h-2
                  w-2
                  rounded-full
                  ${
                    option.value === "DONE"
                      ? "bg-green-500"
                      : option.value ===
                        "IN_PROGRESS"
                      ? "bg-blue-500"
                      : "bg-stone-400"
                  }
                `}
              />

              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}