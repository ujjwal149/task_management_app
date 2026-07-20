"use client";

import { CalendarClock } from "lucide-react";

import { useDashboard } from "@/hooks/useDashboard";

export default function UpcomingDeadlines() {

  const { upcomingDeadlines } = useDashboard();

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

      <div className="mb-5 flex items-center gap-2">

        <CalendarClock
          size={20}
          className="text-blue-600"
        />

        <h2 className="text-lg font-semibold text-stone-900">
          Upcoming Deadlines
        </h2>

      </div>

      {upcomingDeadlines.length === 0 ? (

        <div className="rounded-xl border border-dashed border-stone-300 p-6 text-center">

          <p className="text-sm text-stone-500">
            No upcoming deadlines 🎉
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {upcomingDeadlines.map((task) => (

            <div
              key={task.id}
              className="rounded-xl border border-stone-100 p-4"
            >

              <div className="flex items-center justify-between">

                <p className="font-medium text-stone-800">
                  {task.title}
                </p>

                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold
                  ${
                    task.priority === "HIGH"
                      ? "bg-red-100 text-red-700"
                      : task.priority === "MEDIUM"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {task.priority}
                </span>

              </div>

              <p className="mt-3 text-sm text-stone-500">

                {new Date(task.dueDate).toLocaleDateString(
                  "en-US",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )}

              </p>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}