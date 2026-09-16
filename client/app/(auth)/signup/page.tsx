"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/ui/AuthCard";
import EmailOtpForm from "@/components/auth/EmailOtpForm";
import GoogleSignButton from "@/components/auth/GoogleSignButton";
import Divider from "@/components/auth/Divider";
import { useAuth } from "@/hooks/useAuth";

export default function SignUpPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  useEffect(() => { if (!loading && user) router.replace("/dashboard"); }, [loading, user, router]);
  if (loading || user) return null;
  return <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-8">
    <AuthCard>
      <GoogleSignButton text="Sign up with Google" />
      <Divider />
      <EmailOtpForm mode="signup" />
      <p className="mt-6 text-center text-sm text-stone-500">Already have an account?{" "}
        <Link className="font-semibold text-blue-600" href="/signin">Sign in</Link>
      </p>
    </AuthCard>
  </div>;
}
