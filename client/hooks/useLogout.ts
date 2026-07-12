"use client";

import { useRouter } from "next/navigation";

import { logout as logoutService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export function useLogout() {
  const router = useRouter();

  const clearAuth = useAuthStore((state) => state.logout);

  const logout = async () => {
    try {
      await logoutService();

      clearAuth();

      router.replace("/signin");
    } catch (error) {
      console.error(error);
    }
  };

  return logout;
}