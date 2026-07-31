"use client";

import { useDashboard } from "@/hooks/useDashboard";

export default function PeriodFilter() {

  const {
    period,
    setPeriod,
  } = useDashboard();

  return (

    <div className="rounded-2xl border border-stone-200 bg-white p-2 shadow-sm">
  <select
    value={period}
    onChange={(e) => setPeriod(e.target.value as any)}
    className="
      w-full
      bg-transparent
      px-2 py-2
      text-sm font-medium
      text-stone-700
      outline-none
      cursor-pointer
    "
  >
    <option value="today">Today</option>
    <option value="week">This Week</option>
    <option value="month">This Month</option>
    <option value="year">This Year</option>
    <option value="all">All Time</option>
  </select>
</div>

  );

}