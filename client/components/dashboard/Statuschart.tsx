"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { useDashboard } from "@/hooks/useDashboard";

const COLORS = {
  TODO: "#94A3B8",
  IN_PROGRESS: "#F59E0B",
  DONE: "#22C55E",
};

export default function StatusChart() {
  const { statusDistribution } = useDashboard();

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
        Task Status
      </h2>

      <div className="h-72">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={statusDistribution}
              dataKey="count"
              nameKey="status"
              outerRadius={90}
              label
            >

              {statusDistribution.map((item) => (

                <Cell
                  key={item.status}
                  fill={COLORS[item.status]}
                />

              ))}

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}