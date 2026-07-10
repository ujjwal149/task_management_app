"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const router = useRouter();

  const { user, loading } = useAuth();
    console.log("ProtectedRoute");
    console.log("Loading:", loading);
    console.log("User:", user);

 useEffect(() => {
  console.log("ProtectedRoute effect");
  console.log("loading:", loading);
  console.log("user:", user);

  if (!loading && !user) {
    console.log("🚨 Redirecting...");
    router.replace("/signin");
  } else {
    console.log("✅ Allowed");
  }
}, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}