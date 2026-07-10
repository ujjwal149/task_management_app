"use client";

import { useEffect } from "react";
import { me } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("✅ AuthProvider Rendered");

  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    console.log("✅ useEffect Executed");

    const loadUser = async () => {
      console.log("➡️ Calling /auth/me");

      try {
        setLoading(true);

        const response = await me();

        console.log("✅ Response:", response);

        setUser(response.user);
      } catch (error) {
        console.log("❌ Error:", error);

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [setUser, setLoading]);

  return <>{children}</>;
}