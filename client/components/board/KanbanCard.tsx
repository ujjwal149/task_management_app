"use client";

import {
  useDraggable,
} from "@dnd-kit/core";

import { CSS } from "@dnd-kit/utilities";

import TaskCard from "@/components/task/TaskCard";

import { Task } from "@/types/task.types";

type Props = {
  task: Task;
};

export default function KanbanCard({
  task,
}: Props) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({

    id: task.id,

  });

  const style = {

    transform: CSS.Translate.toString(
      transform
    ),

  };

  return (

    <div
      ref={setNodeRef}
      style={style}
      className="touch-none select-none max-w-full cursor-pointer"
      {...listeners}
      {...attributes}
    >

      <TaskCard task={task} />

    </div>

  );

}