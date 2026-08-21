"use client";

import { useDroppable } from "@dnd-kit/core";

import { Task, TaskStatus } from "@/types/task.types";

import KanbanTaskCard from "./KanbanCard";

type Props = {
  title: string;
  status: TaskStatus;
  tasks: Task[];
};

export default function KanbanColumn({
  title,
  status,
  tasks,
}: Props) {

  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id: status,
  });

  const columnTasks =
    tasks.filter(
      (task) => task.status === status
    );

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[500px]
        rounded-2xl
        border
        border-stone-200
        bg-stone-50
        p-4
        transition
        ${isOver ? "ring-2 ring-blue-400" : ""}
      `}
    >

      <div className="mb-4 flex items-center justify-between">

        <h2 className="font-semibold text-stone-800">
          {title}
        </h2>

        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-stone-500">
          {columnTasks.length}
        </span>

      </div>


      <div className="space-y-3">

        {columnTasks.map((task) => (

          <KanbanTaskCard
            key={task.id}
            task={task}
          />

        ))}

      </div>

    </div>
  );
}