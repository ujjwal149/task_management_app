"use client";

import { useUserStore } from "@/store/user.store";

export function useUsers() {
  return useUserStore();
}