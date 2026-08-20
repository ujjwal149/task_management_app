"use client";

import { useEffect } from "react";

import {
  DndContext,
  DragEndEvent,
} from "@dnd-kit/core";

import { updateTaskStatus } from "@/services/task.service";
import { TaskStatus } from "@/types/task.types";

import { useTaskStore } from "@/store/task.store";

import KanbanColumn from "./KanbanColumn";

import BoardSkeleton from "@/components/loading/BoardSkeleton";

export default function KanbanBoard() {

  const {
  tasks,
  moveTask,
  fetchTasks,
  loading,
} = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDragEnd = async (
  event: DragEndEvent
) => {

  const { active, over } = event;

  if (!over) return;

  const taskId = active.id as string;

  const newStatus =
    over.id as TaskStatus;

  const task =
    tasks.find((t) => t.id === taskId);

  if (!task) return;

  if (task.status === newStatus)
    return;

  // Optimistic UI

  moveTask(taskId, newStatus);

  try {

    await updateTaskStatus(
      task,
      newStatus
    );

  } catch (error) {

    console.error(error);

    fetchTasks();

  }

};

  if (loading) {
    return <BoardSkeleton />;
  }

  return (
  <div className="relative w-full overflow-hidden">
    <DndContext
      onDragEnd={handleDragEnd}
    >

      <div className="grid gap-6 lg:grid-cols-3">

        <KanbanColumn
          title="Todo"
          status="TODO"
        />

        <KanbanColumn
          title="In Progress"
          status="IN_PROGRESS"
        />

        <KanbanColumn
          title="Done"
          status="DONE"
        />

      </div>

    </DndContext>
  </div>

  );

}