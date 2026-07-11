"use client";

import { useEffect } from "react";
import { me } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  

  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    

    const loadUser = async () => {
      

      try {
        setLoading(true);

        const response = await me();

        setUser(response.user);
      } catch (error) {
       

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [setUser, setLoading]);

  return <>{children}</>;
}