"use client"
import { isAxiosError } from "axios";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthCard from "@/components/ui/AuthCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import {signupSchema,SignUpFormData,} from "@/validations/auth.schema";

import { signup, verifySignup } from "@/services/auth.service"
import { useAuth } from  "@/hooks/useAuth";

import GoogleSignButton from "@/components/auth/GoogleSignButton";
import Divider from "@/components/auth/Divider";

export default function SignUpPage(){
  const router = useRouter();

  const {user,loading,setUser} = useAuth();

  const [pendingSignup, setPendingSignup] = useState <{
    signupId: string;
    email: string;
    expiresAt: string;
  } | null>(null);

  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if(!loading && user){
      router.replace("/dashboard");
    }
  },[loading,user,router]);

  useEffect(() => {
    if (resendSeconds <= 0) return;

    const timer = setTimeout(() => {
      setResendSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendSeconds]);


  const {
    register,
    handleSubmit,
    getValues,
    formState:{errors,isSubmitting},
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async(data: SignUpFormData ) => {
    setErrorMessage("");

    try{
      const response = await signup(data);

      setOtp("");

      setPendingSignup({
        signupId: response.signupId,
        email: response.email,
        expiresAt: response.expiresAt,
      });
      setResendSeconds(60);

    }catch (error: unknown) {
    setErrorMessage(
      isAxiosError(error)
        ? error.response?.data?.message ??
            "Unable to send the code. Please try again."
        : "Something went wrong. Please try again."
    );
  }
  };

  const onVerify = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (!pendingSignup || isVerifying || isResending) return;

  setErrorMessage("");
  setIsVerifying(true);

  try {
    const response = await verifySignup({
      signupId: pendingSignup.signupId,
      email: pendingSignup.email,
      otp,
    });

    setUser(response.user);
    router.replace("/dashboard");
  } catch (error: unknown) {
    setErrorMessage(
      isAxiosError(error)
        ? error.response?.data?.message ??
            "Unable to verify the code. Please try again."
        : "Something went wrong. Please try again."
    );
  } finally {
    setIsVerifying(false);
  }
};

const onResend = async () => {
  if (
    !pendingSignup ||
    resendSeconds > 0 ||
    isResending ||
    isVerifying
  ) {
    return;
  }

  setErrorMessage("");
  setIsResending(true);

  // Start a cooldown even if the response is lost after sending.
  setResendSeconds(60);

  try {
    const response = await signup({
      ...getValues(),
      email: pendingSignup.email,
    });

    setPendingSignup({
      signupId: response.signupId,
      email: response.email,
      expiresAt: response.expiresAt,
    });

    setOtp("");
    setResendSeconds(60);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      setErrorMessage(
        error.response?.data?.message ??
          "Unable to resend the code. Please try again later."
      );

      const retryAfter = Number(
        error.response?.data?.retryAfter ??
          error.response?.headers["retry-after"]
      );

      if (Number.isFinite(retryAfter) && retryAfter > 0) {
        setResendSeconds(Math.ceil(retryAfter));
      }
    } else {
      setErrorMessage("Something went wrong. Please try again later.");
    }
  } finally {
    setIsResending(false);
  }
};

  if(loading){
    return null;
  }
  if(user){
    return null;
  }

  return(
    <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-8">
      <AuthCard >

        <div className="mt-6">
          <GoogleSignButton text="Sign Up with google"/>
        </div>
        

        <Divider/>

        
        {errorMessage && (
          <p role="alert" className="mb-4 text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        {pendingSignup ? (
          <form onSubmit={onVerify} className="space-y-4 ">
            <div className=" flex justify-center items-center">
            <h2 className="text-xl font-semibold">
              Verify your email
            </h2>
            </div>

            <p className="text-sm text-stone-600">
              Enter the six-digit code sent to{" "}
              <strong>{pendingSignup.email}</strong>.
              The code expires in 10 minutes.
            </p>
        
            <Input
              type="text"
              aria-label="Verification code"
              placeholder="Enter six-digit code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              minLength={6}
              maxLength={6}
              required
              disabled={isVerifying || isResending }
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, ""))
              }
            />

            <Button
              type="submit"
              disabled={isVerifying || isResending}
            >
              {isVerifying ? "Verifying..." : "Verify and create account"}
            </Button>

            <Button
              type="button"
              onClick={onResend}
              disabled={resendSeconds > 0 || isResending || isVerifying}
              className="mt-3"
            >
              {isResending
                ? "Sending..."
                : resendSeconds > 0
                  ? `Resend code in ${resendSeconds}s`
                  : "Resend code"}
            </Button>
        </form>
        ) : (
        
        <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        >

          {/*Name*/}
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
                Name
              </label>
            <Input
              type="text"
              placeholder="Enter your name"
              {...register("name")}
            />
            
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/*Email*/}
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
                Email
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
            />

              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
          </div>

          {/*Password*/}
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
                Password
              </label>
            <Input
            type="password"
            placeholder="Enter your password"
            {...register("password")}
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/*Button*/}
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            Sign Up
          </Button>
        </form>

        )}
        <div className="mt-6 border-t border-stone-200 pt-5 text-center">

            <p className="text-sm text-stone-500">

              Already have an account?{" "}

              <button
                onClick={() => router.push("/signin")}
                className="font-semibold text-blue-600 transition hover:text-blue-700 cursor-pointer"
              >
                Sign In
              </button>

            </p>

          </div>
      </AuthCard>
    </div>
  )
}