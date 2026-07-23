"use client";

import { useMemo } from "react";

import { useTaskStore } from "@/store/task.store";

import KanbanCard from "./KanbanCard";

import { TaskStatus } from "@/types/task.types";

import { useDroppable } from "@dnd-kit/core";

type Props = {
  title: string;
  status: TaskStatus;
};

export default function KanbanColumn({
  title,
  status,
}: Props) {

  const tasks =
    useTaskStore((state) => state.tasks);

  const { setNodeRef } = useDroppable({
      id: status,
  });

  const filteredTasks = useMemo(() => {

    return tasks.filter(
      (task) => task.status === status
    );

  }, [tasks, status]);

  return (
    <div
      ref={setNodeRef}
      
      className="
        rounded-2xl
        border
        border-stone-200
        bg-stone-50
        p-4
        min-h-[650px]
      "
    >
      <div className="mb-5">

        <h2 className="text-lg font-semibold">
          {title}
        </h2>

        <p className="text-sm text-stone-500">
          {filteredTasks.length} Tasks
        </p>

      </div>

      <div className="space-y-3">

        {filteredTasks.map((task) => (

          <KanbanCard
            key={task.id}
            task={task}
          />

        ))}

      </div>

    </div>
  );
}