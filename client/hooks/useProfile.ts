import { useProfileStore } from "@/store/profile.store";

export function useProfile() {
  return useProfileStore();
}