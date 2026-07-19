"use client";

import { CalendarClock } from "lucide-react";

import { useTasks } from "@/hooks/useTasks";

export default function UpcomingDeadlines() {
  const { tasks } = useTasks();

  const upcomingTasks = [...tasks]
    .filter((task) => task.dueDate)
    .sort(
      (a, b) =>
        new Date(a.dueDate!).getTime() -
        new Date(b.dueDate!).getTime()
    )
    .slice(0, 3);

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

      <div className="space-y-4">

        {upcomingTasks.length === 0 ? (

          <p className="text-sm text-stone-500">
            No upcoming deadlines.
          </p>

        ) : (

          upcomingTasks.map((task) => (

            <div
              key={task.id}
              className="rounded-xl border border-stone-100 p-4"
            >

              <p className="font-medium text-stone-800">
                {task.title}
              </p>

              <p className="mt-2 text-sm text-stone-500">
                {new Date(task.dueDate!).toLocaleDateString()}
              </p>

            </div>

          ))

        )}

      </div>

    </div>
  );
}