"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

import { useDashboard } from "@/hooks/useDashboard";

const COLORS = {
  LOW: "#3B82F6",
  MEDIUM: "#FACC15",
  HIGH: "#EF4444",
};

export default function PriorityChart() {

  const { priorityDistribution } = useDashboard();

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
        Priority Distribution
      </h2>

      <div className="h-72">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart data={priorityDistribution}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="priority" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="count"
              radius={[8, 8, 0, 0]}
            >

              {priorityDistribution.map((item) => (

                <Cell
                  key={item.priority}
                  fill={COLORS[item.priority]}
                />

              ))}

            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}