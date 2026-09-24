"use client";

import { useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthCard from "@/components/ui/AuthCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import {
  forgotPassword,
  resetPassword,
} from "@/services/auth.service";

import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
} from "@/validations/auth.schema";

import { useAuth } from "@/hooks/useAuth";

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (typeof message === "string") {
      return message;
    }
  }

  return "Unable to complete the request. Please try again.";
}

export default function ForgotPasswordPage() {
  const { setUser } = useAuth();

  const [resetId, setResetId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [completed, setCompleted] = useState(false);

  const emailForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const passwordForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onRequestCode = async (
    data: ForgotPasswordFormData
  ) => {
    setErrorMessage("");
    setMessage("");

    try {
      const response = await forgotPassword(data);

      passwordForm.reset();
      setResetId(response.resetId);
      setMessage(response.message);
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  const onResetPassword = async (
    data: ResetPasswordFormData
  ) => {
    if (!resetId) {
      return;
    }

    setErrorMessage("");

    try {
      const response = await resetPassword({
        resetId,
        otp: data.otp,
        newPassword: data.newPassword,
      });

      // The backend invalidated existing sessions.
      // Clear any user still held in frontend memory.
      setUser(null);

      passwordForm.reset();
      emailForm.reset();
      setResetId(null);
      setMessage(response.message);
      setCompleted(true);
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-8">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-center text-4xl font-bold text-blue-600">
          TaskFlow
        </h1>

        <AuthCard>
          <h2 className="mb-3 text-center text-2xl font-semibold">
            {completed
              ? "Password updated"
              : resetId
                ? "Set a new password"
                : "Forgot password?"}
          </h2>

          {errorMessage && (
            <p
              role="alert"
              className="mb-4 text-sm text-red-600"
            >
              {errorMessage}
            </p>
          )}

          {message && (
            <p
              role="status"
              className="mb-5 text-sm text-stone-600"
            >
              {message}
            </p>
          )}

          {completed ? (
            <Link
              href="/signin"
              className="block rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700"
            >
              Back to sign in
            </Link>
          ) : resetId ? (
            <form
              onSubmit={passwordForm.handleSubmit(onResetPassword)}
              className="space-y-4"
            >
              <p className="text-sm text-stone-600">
                Enter the six-digit code from your email.
                The code expires in 10 minutes.
              </p>

              <div>
                <label
                  htmlFor="reset-otp"
                  className="mb-2 block text-sm font-medium"
                >
                  Verification code
                </label>

                <Input
                  id="reset-otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="Six-digit code"
                  maxLength={6}
                  disabled={passwordForm.formState.isSubmitting}
                  {...passwordForm.register("otp")}
                />

                {passwordForm.formState.errors.otp && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordForm.formState.errors.otp.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="new-password"
                  className="mb-2 block text-sm font-medium"
                >
                  New password
                </label>

                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter your new password"
                  disabled={passwordForm.formState.isSubmitting}
                  {...passwordForm.register("newPassword")}
                />

                {passwordForm.formState.errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-2 block text-sm font-medium"
                >
                  Confirm new password
                </label>

                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter your new password again"
                  disabled={passwordForm.formState.isSubmitting}
                  {...passwordForm.register("confirmPassword")}
                />

                {passwordForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={passwordForm.formState.isSubmitting}
              >
                {passwordForm.formState.isSubmitting
                  ? "Resetting password..."
                  : "Reset password"}
              </Button>
            </form>
          ) : (
            <form
              onSubmit={emailForm.handleSubmit(onRequestCode)}
              className="space-y-4"
            >
              <p className="text-sm text-stone-600">
                Enter your account email to request a
                password-reset code.
              </p>

              <div>
                <label
                  htmlFor="reset-email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email
                </label>

                <Input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  disabled={emailForm.formState.isSubmitting}
                  {...emailForm.register("email")}
                />

                {emailForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {emailForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={emailForm.formState.isSubmitting}
              >
                {emailForm.formState.isSubmitting
                  ? "Requesting code..."
                  : "Send reset code"}
              </Button>
            </form>
          )}

          {!completed && (
            <div className="mt-6 border-t border-stone-200 pt-5 text-center">
              <Link
                href="/signin"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Back to sign in
              </Link>
            </div>
          )}
        </AuthCard>
      </div>
    </div>
  );
}