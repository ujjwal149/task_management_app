"use client";

import "react-circular-progressbar/dist/styles.css";

import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

export default function ProductivityCard() {
  const completed = 18;
  const total = 24;

  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm p-6 
                    transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ">

      <h2 className="mb-6 text-lg font-semibold text-stone-900">
        Productivity
      </h2>

      <div className="mx-auto h-40 w-40">

        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            pathColor: "#2563EB",
            textColor: "#2563EB",
            trailColor: "#E7E5E4",
          })}
        />

      </div>

      <div className="mt-6 text-center">

        <p className="text-2xl font-bold text-stone-900">
          {completed} / {total}
        </p>

        <p className="mt-1 text-sm text-stone-500">
          Tasks Completed
        </p>

      </div>

      <div className="mt-6 rounded-xl bg-blue-50 p-4">

        <p className="text-center text-sm font-medium text-blue-700">
          Great work! Keep the momentum going 🚀
        </p>

      </div>

    </div>
  );
}