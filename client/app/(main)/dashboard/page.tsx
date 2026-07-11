"use client";

import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";

import { logout } from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const router = useRouter();

  const { user, logout: clearAuth } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();

      clearAuth();

      router.replace("/signin");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-slate-800">
        Dashboard
      </h1>

      <p className="mb-8 text-slate-600">
        Welcome, <strong>{user?.name}</strong>
      </p>

      <Button onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}