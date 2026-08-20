export default function BoardSkeleton() {
  return (
    <div
      className="
        grid
        gap-6
        lg:grid-cols-3
        animate-pulse
      "
    >
      <KanbanColumnSkeleton />
      <KanbanColumnSkeleton />
      <KanbanColumnSkeleton />
    </div>
  );
}

function KanbanColumnSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      {/* Column header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="h-5 w-24 rounded bg-slate-200" />

        <div className="h-6 w-8 rounded-full bg-slate-200" />
      </div>

      {/* Task cards */}
      <div className="space-y-4">
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
      </div>
    </div>
  );
}

function TaskCardSkeleton() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      {/* Title */}
      <div className="h-4 w-3/4 rounded bg-slate-200" />

      {/* Description */}
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-2/3 rounded bg-slate-100" />
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between">
        <div className="h-5 w-16 rounded-full bg-slate-100" />

        <div className="h-7 w-7 rounded-full bg-slate-200" />
      </div>
    </div>
  );
}