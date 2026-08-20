export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">

      {/* Breadcrumb */}
      <div className="h-4 w-32 rounded bg-slate-200" />

      {/* Hero + Period Filter */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

        {/* Hero */}
        <div className="flex-1">
          <div className="rounded-xl bg-slate-200 p-6">
            <div className="h-3 w-28 rounded bg-slate-300" />

            <div className="mt-3 h-8 w-80 max-w-full rounded bg-slate-300" />

            <div className="mt-3 h-4 w-96 max-w-full rounded bg-slate-300" />
            <div className="mt-2 h-4 w-72 max-w-full rounded bg-slate-300" />
          </div>
        </div>

        {/* Period Filter */}
        <div className="h-10 w-full rounded-lg bg-slate-200 lg:w-32" />
      </div>

      {/* Statistics */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />

      </div>

      {/* Main Dashboard */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Left */}
        <div className="space-y-6 lg:col-span-2">

          {/* Weekly Activity + Status */}
          <div className="grid gap-6 lg:grid-cols-2">

            <ChartSkeleton />
            <ChartSkeleton />

          </div>

          {/* Priority Distribution */}
          <ChartSkeleton wide />

          {/* Recent Tasks + Recent Activity */}
          <div className="grid gap-6 lg:grid-cols-2">

            <ListSkeleton />
            <ListSkeleton />

          </div>

        </div>

        {/* Right */}
        <div className="space-y-6">

          <ListSkeleton />

          <ScheduleSkeleton />

          <ProductivitySkeleton />

          <QuickActionsSkeleton />

        </div>

      </div>
    </div>
  );
}


/* -------------------------------- */
/* Statistic Card Skeleton */
/* -------------------------------- */

function StatSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="h-3 w-20 rounded bg-slate-200" />

      <div className="mt-4 h-8 w-14 rounded bg-slate-200" />
    </div>
  );
}


/* -------------------------------- */
/* Chart Skeleton */
/* -------------------------------- */

function ChartSkeleton({
  wide = false,
}: {
  wide?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${
        wide ? "min-h-[170px]" : "min-h-[250px]"
      }`}
    >
      {/* Title */}
      <div className="h-4 w-28 rounded bg-slate-200" />

      {/* Chart area */}
      <div className="mt-6 flex h-40 items-end gap-3">

        <div className="h-[30%] flex-1 rounded-t bg-slate-100" />
        <div className="h-[45%] flex-1 rounded-t bg-slate-100" />
        <div className="h-[65%] flex-1 rounded-t bg-slate-100" />
        <div className="h-[40%] flex-1 rounded-t bg-slate-100" />
        <div className="h-[75%] flex-1 rounded-t bg-slate-100" />
        <div className="h-[55%] flex-1 rounded-t bg-slate-100" />
        <div className="h-[35%] flex-1 rounded-t bg-slate-100" />

      </div>
    </div>
  );
}


/* -------------------------------- */
/* Generic List Skeleton */
/* -------------------------------- */

function ListSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      {/* Title */}
      <div className="h-4 w-32 rounded bg-slate-200" />

      {/* Items */}
      <div className="mt-5 space-y-4">

        <ListItem />
        <ListItem />
        <ListItem />
        <ListItem />
        <ListItem />

      </div>
    </div>
  );
}


function ListItem() {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0">

      <div className="flex-1 space-y-2">

        <div className="h-3 w-32 rounded bg-slate-200" />

        <div className="h-2.5 w-20 rounded bg-slate-100" />

      </div>

      <div className="h-5 w-12 rounded-full bg-slate-100" />

    </div>
  );
}


/* -------------------------------- */
/* Today's Schedule */
/* -------------------------------- */

function ScheduleSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="h-4 w-32 rounded bg-slate-200" />

      <div className="mt-5 space-y-4">

        <ScheduleItem />
        <ScheduleItem />
        <ScheduleItem />
        <ScheduleItem />

      </div>
    </div>
  );
}


function ScheduleItem() {
  return (
    <div className="flex items-center gap-3">

      <div className="h-8 w-8 shrink-0 rounded-full bg-slate-100" />

      <div className="flex-1 space-y-2">
        <div className="h-3 w-32 rounded bg-slate-200" />
        <div className="h-2.5 w-20 rounded bg-slate-100" />
      </div>

      <div className="h-2.5 w-12 rounded bg-slate-100" />

    </div>
  );
}


/* -------------------------------- */
/* Productivity */
/* -------------------------------- */

function ProductivitySkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="h-4 w-24 rounded bg-slate-200" />

      <div className="mt-6 flex flex-col items-center">

        {/* Circle */}
        <div className="h-24 w-24 rounded-full border-[10px] border-slate-100" />

        <div className="mt-4 h-4 w-16 rounded bg-slate-200" />

        <div className="mt-2 h-3 w-24 rounded bg-slate-100" />

      </div>

      <div className="mt-5 h-8 w-full rounded-lg bg-slate-100" />

    </div>
  );
}


/* -------------------------------- */
/* Quick Actions */
/* -------------------------------- */

function QuickActionsSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="h-4 w-28 rounded bg-slate-200" />

      <div className="mt-5 space-y-3">

        <ActionSkeleton />
        <ActionSkeleton />
        <ActionSkeleton />

      </div>

    </div>
  );
}


function ActionSkeleton() {
  return (
    <div className="flex h-9 items-center gap-3 rounded-lg border border-slate-100 px-3">

      <div className="h-4 w-4 rounded bg-slate-100" />

      <div className="h-3 w-24 rounded bg-slate-100" />

    </div>
  );
}