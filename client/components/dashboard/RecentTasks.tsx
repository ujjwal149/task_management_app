"use client";

import { useDashboard } from "@/hooks/useDashboard";

export default function RecentTasks() {

  const { recentTasks } = useDashboard();

  return (

    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

      <h2 className="mb-5 text-lg font-semibold text-stone-900">
        Recent Tasks
      </h2>

      <div className="space-y-4">

        {recentTasks.length === 0 ? (

          <p className="text-sm text-stone-500">
            No recent tasks.
          </p>

        ) : (

          recentTasks.map((task) => (

            <div
              key={task.id}
              className="flex items-center justify-between rounded-xl border border-stone-100 p-4"
            >

              <span className="font-medium text-stone-700">
                {task.title}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  task.status === "DONE"
                    ? "bg-green-100 text-green-700"
                    : task.status === "TODO"
                    ? "bg-stone-100 text-stone-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {task.status.replace("_", " ")}
              </span>

            </div>

          ))

        )}

      </div>

    </div>

  );

}