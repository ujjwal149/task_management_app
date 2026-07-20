"use client";

import { useDashboard } from "@/hooks/useDashboard";

export default function PeriodFilter() {

  const {
    period,
    setPeriod,
  } = useDashboard();

  return (

    <select
      value={period}
      onChange={(e) =>
        setPeriod(e.target.value as any)
      }
      className=" rounded-xl border border-stone-300 px-2 py-2 text-sm outline-none focus:border-blue-600 cursor-pointer"
    >

      <option value="today">
        Today
      </option>

      <option value="week">
        This Week
      </option>

      <option value="month">
        This Month
      </option>

      <option value="year">
        This Year
      </option>

      <option value="all">
        All Time
      </option>

    </select>

  );

}