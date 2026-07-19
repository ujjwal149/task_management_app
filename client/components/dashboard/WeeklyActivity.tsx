"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
} from "recharts";

import { useDashboard } from "@/hooks/useDashboard";

export default function WeeklyActivity() {

  const { weeklyActivity } = useDashboard();

  return (
    <div
      className="
        rounded-2xl
        border
        border-stone-200
        bg-white
        shadow-sm
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      <h2 className="mb-6 text-lg font-semibold text-stone-900">
        Weekly Activity
      </h2>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">

          <AreaChart data={weeklyActivity}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e7e5e4"
            />

            <XAxis dataKey="day" />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="tasks"
              stroke="#2563eb"
              fill="#93c5fd"
            />

          </AreaChart>

        </ResponsiveContainer>
      </div>
    </div>
  );
}