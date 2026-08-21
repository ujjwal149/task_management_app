"use client";

import { useEffect } from "react";

import {
  DndContext,
  DragEndEvent,
} from "@dnd-kit/core";

import { updateTaskStatus } from "@/services/task.service";
import { TaskStatus } from "@/types/task.types";

import { useTaskStore } from "@/store/task.store";
import { useAuthStore } from "@/store/auth.store";

import KanbanColumn from "./KanbanColumn";

import BoardSkeleton from "@/components/loading/BoardSkeleton";

export default function KanbanBoard() {

  const {
    tasks,
    moveTask,
    fetchTasks,
    loading,
  } = useTaskStore();

  const { user } = useAuthStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);


  // ---------------------------------------------
  // Permission
  // ---------------------------------------------

  const visibleTasks = tasks.filter((task) => {

    if (!user) {
      return false;
    }

    // Project ADMIN can see every task
    const isProjectAdmin =
      task.project?.creatorId === user.id;

    if (isProjectAdmin) {
      return true;
    }

    // USER can see only their assigned tasks
    const isAssignedToCurrentUser =
      task.assignToId === user.id;

    return isAssignedToCurrentUser;
  });


  // ---------------------------------------------
  // Drag & Drop
  // ---------------------------------------------

  const handleDragEnd = async (
    event: DragEndEvent
  ) => {

    const { active, over } = event;

    if (!over) return;

    const taskId = String(active.id);

    const newStatus =
      over.id as TaskStatus;

    const task =
      visibleTasks.find(
        (task) => task.id === taskId
      );

    if (!task) return;

    // No status change
    if (task.status === newStatus) {
      return;
    }

    // Optimistic update
    moveTask(
      taskId,
      newStatus
    );

    try {

      await updateTaskStatus(
        task.id,
        newStatus
      );

    } catch (error) {

      console.error(
        "Failed to update task status:",
        error
      );

      await fetchTasks();
    }
  };


  // ---------------------------------------------
  // Loading
  // ---------------------------------------------

  if (loading) {
    return <BoardSkeleton />;
  }


  // ---------------------------------------------
  // Empty state
  // ---------------------------------------------

  if (visibleTasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-stone-300 p-10 text-center">

        <h2 className="text-lg font-semibold text-stone-900">
          No tasks available
        </h2>

        <p className="mt-2 text-sm text-stone-500">
          You don't have any tasks that you can update.
        </p>

      </div>
    );
  }


  // ---------------------------------------------
  // Board
  // ---------------------------------------------

  return (
    <div className="relative w-full overflow-hidden">

      <DndContext
        onDragEnd={handleDragEnd}
      >

        <div className="grid gap-6 lg:grid-cols-3">

          <KanbanColumn
            title="Todo"
            status="TODO"
            tasks={visibleTasks}
          />

          <KanbanColumn
            title="In Progress"
            status="IN_PROGRESS"
            tasks={visibleTasks}
          />

          <KanbanColumn
            title="Done"
            status="DONE"
            tasks={visibleTasks}
          />

        </div>

      </DndContext>

    </div>
  );
}