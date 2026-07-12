"use client";

import { useAuth } from "@/hooks/useAuth";

export default function HeroSection() {
  const { user } = useAuth();

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white shadow-lg">

      <p className="text-sm opacity-90">
        {today}
      </p>

      <h1 className="mt-2 text-4xl font-bold">
        {greeting}, {user?.name}! 👋
      </h1>

      <p className="mt-4 max-w-xl text-blue-100">
        Welcome back to TaskFlow.
        Stay focused, organize your work, and complete your goals efficiently.
      </p>

    </div>
  );
}