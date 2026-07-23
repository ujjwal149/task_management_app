"use client";

import KanbanBoard from "@/components/board/KanbanBoard";

export default function BoardPage() {
  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold text-stone-900">
          Task Board
        </h1>

        <p className="mt-1 text-stone-500">
          Drag and drop tasks between columns.
        </p>

      </div>

      <KanbanBoard />

    </div>
  );
}