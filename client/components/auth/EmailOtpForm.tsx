"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { signupSchema } from "@/validations/auth.schema";
import {
  signup, verifySignup, requestLoginOtp, verifyLoginOtp, forgotPassword, resetPassword,
  type OtpChallenge,
} from "@/services/auth.service";

type Mode = "signup" | "login" | "reset";
export default function EmailOtpForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { setUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [challenge, setChallenge] = useState<OtpChallenge | null>(null);
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(value => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  function handleError(error: unknown) {
    setError(isAxiosError(error) ? error.response?.data?.message ?? "Unable to connect. Please try again." :
      error instanceof Error ? error.message : "Something went wrong. Please try again.");
    if (isAxiosError(error)) {
      const retry = Number(error.response?.headers["retry-after"]);
      if (Number.isFinite(retry) && retry > 0) setCooldown(retry);
    }
  }
  async function sendCode() {
    setBusy(true); setError(""); setMessage("");
    try {
      const normalized = email.trim().toLowerCase();
      if (mode === "signup") {
        const parsed = signupSchema.safeParse({ name, email: normalized, password });
        if (!parsed.success) throw new Error(parsed.error.issues[0].message);
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
      }
      const result = mode === "signup" ? await signup({ name, email: normalized, password }) :
        mode === "login" ? await requestLoginOtp(normalized) : await forgotPassword(normalized);
      setEmail(normalized); setChallenge(result); setCode("");
      setCooldown(result.retryAfter); setMessage(result.message);
    } catch (error) { handleError(error); }
    finally { setBusy(false); }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!challenge) return sendCode();
    setBusy(true); setError(""); setMessage("");
    try {
      const data = { email, challengeId: challenge.challengeId, code };
      if (mode === "reset") {
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        if (password.length < 8 || new TextEncoder().encode(password).length > 72) {
          throw new Error("Use at least 8 characters and at most 72 UTF-8 bytes for your password.");
        }
        const result = await resetPassword({ ...data, password });
        setUser(null); setComplete(true); setMessage(result.message);
      } else {
        const result = mode === "signup" ? await verifySignup(data) : await verifyLoginOtp(data);
        setUser(result.user); router.replace("/dashboard");
      }
      setPassword(""); setConfirmPassword(""); setCode("");
    } catch (error) { handleError(error); }
    finally { setBusy(false); }
  }

  return <div className="space-y-4">
    <h1 className="text-2xl font-semibold text-stone-800">
      {mode === "signup" ? "Create your account" : mode === "login" ? "Sign in with an email code" : "Reset your password"}
    </h1>
    {message && <p role="status" className="text-sm text-stone-600">{message}</p>}
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    {complete ? <Link className="block font-semibold text-blue-600" href="/signin">Back to sign in</Link> :
      <form onSubmit={submit} className="space-y-4">
        <fieldset disabled={busy} className="space-y-4">
          {!challenge && <>
            {mode === "signup" && <Input aria-label="Name" label="Name" autoComplete="name" required minLength={3} maxLength={50}
              value={name} onChange={event => setName(event.target.value)} />}
            <Input aria-label="Email" label="Email" type="email" autoComplete="email" required maxLength={254}
              value={email} onChange={event => setEmail(event.target.value)} />
          </>}
          {challenge && <>
            <p className="text-sm text-stone-600">Enter the six-digit code sent to <strong>{email}</strong>. It expires in 10 minutes.</p>
            <Input aria-label="Verification code" label="Verification code" autoComplete="one-time-code" inputMode="numeric"
              pattern="[0-9]{6}" minLength={6} maxLength={6} required value={code}
              onChange={event => setCode(event.target.value.replace(/\D/g, ""))} />
          </>}
          {((mode === "signup" && !challenge) || (mode === "reset" && challenge)) && <>
            <Input aria-label="New password" label="Password" type="password" autoComplete="new-password" required minLength={8}
              value={password} onChange={event => setPassword(event.target.value)} />
            <Input aria-label="Confirm password" label="Confirm password" type="password" autoComplete="new-password" required minLength={8}
              value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} />
            <p className="text-xs text-stone-500">At least 8 characters; at most 72 UTF-8 bytes.</p>
          </>}
          <Button type="submit" loading={busy} disabled={!challenge && cooldown > 0}>
            {!challenge ? (cooldown > 0 ? `Try again in ${cooldown}s` : "Send verification code") :
              mode === "signup" ? "Verify email and create account" : mode === "login" ? "Verify and sign in" : "Reset password"}
          </Button>
          {challenge && <>
            <Button type="button" variant="secondary" disabled={cooldown > 0} onClick={sendCode}>
              {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
            </Button>
            <button type="button" className="text-sm text-blue-600" onClick={() => {
              setChallenge(null); setCode(""); setError(""); setMessage("");
            }}>Change email{mode === "signup" ? " or account details" : ""}</button>
          </>}
        </fieldset>
      </form>}
  </div>;
}
