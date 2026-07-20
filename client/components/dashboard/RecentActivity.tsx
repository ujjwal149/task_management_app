"use client";

import { CheckCircle2, Clock3,} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";



export default function RecentActivity() {

  const { recentActivity } = useDashboard();

  return (

    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

      <h2 className="mb-6 text-lg font-semibold text-stone-900">
        Recent Activity
      </h2>

      <div className="space-y-5">

        {recentActivity.length === 0 ? (

          <p className="text-center text-sm text-stone-500">
            No recent activity
          </p>

        ) : (

          recentActivity.map((task) => (

            <div
              key={task.id}
              className="flex items-start gap-4"
            >

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full
                ${
                  task.status === "DONE"
                    ? "bg-green-100 text-green-600"
                    : task.status === "IN_PROGRESS"
                    ? "bg-amber-100 text-amber-600"
                    : "bg-stone-100 text-stone-600"
                }`}
              >

                {task.status === "DONE" ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <Clock3 size={20} />
                )}

              </div>

              <div className="flex-1">

                <p className="font-semibold text-stone-900">
                  {task.title}
                </p>

                <p className="text-sm text-stone-500">
                  {task.status.replace("_", " ")}
                </p>

              </div>

              <span className="text-xs text-stone-400">

                {new Date(task.updatedAt).toLocaleDateString()}

              </span>

            </div>

          ))

        )}

      </div>

    </div>

  );

}