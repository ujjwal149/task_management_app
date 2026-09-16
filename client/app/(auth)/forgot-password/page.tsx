import Link from "next/link";
import AuthCard from "@/components/ui/AuthCard";
import EmailOtpForm from "@/components/auth/EmailOtpForm";

export default function ForgotPasswordPage() {
  return <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-8">
    <AuthCard>
      <EmailOtpForm mode="reset" />
      <Link className="mt-6 block text-center text-sm text-blue-600" href="/signin">Back to sign in</Link>
    </AuthCard>
  </div>;
}
