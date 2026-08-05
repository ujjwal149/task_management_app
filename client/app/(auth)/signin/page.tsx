"use client";

import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {Eye,EyeOff} from "lucide-react"

import AuthCard from "@/components/ui/AuthCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { signInSchema, SignInFormData,} from "@/validations/auth.schema";

import { signin } from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";

import GoogleSignInButton from "@/components/auth/GoogleSignButton";
import Divider from "@/components/auth/Divider";

export default function SignInPage() {
  const router = useRouter();

  const { user, loading, setUser } = useAuth();

  const [showPassword,setShowPassword] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const response = await signin(data);

      setUser(response.user);

      router.replace("/dashboard");
    } catch (error: any) {
      const backendMessage = error.response?.data?.message || 
            "Something went wrong";
        
      setError("password",{
        type: "server",
        message: backendMessage,
      });

      console.log(error.response?.data);
    }
  };

  if (loading || user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-8">

      <div className="w-full max-w-md">

        {/* Logo */}

        <div className="mb-8 text-center">

          <h1 className="text-4xl font-bold text-blue-600">
            TaskFlow
          </h1>

        </div>

        <AuthCard>

          <div className="mt-6">
            <GoogleSignInButton text="Continue with google"/>
          </div>

          <Divider/>

            <div className="relative h-6 w-full">
              {errors.password && (
                <p className="absolute inset-x-0 top-0 text-center text-sm font-medium text-red-500 animate-fadeIn">
                  {errors.password.message}
                </p>
              )}
            </div>


          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >

            {/* Email */}

            <div>

              <label className="mb-2 block text-sm font-medium text-stone-700">
                Email
              </label>

              <Input
                type="email"
                placeholder="john@example.com"
                {...register("email")}
              />

              {errors.email && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}

            </div>

            {/* Password */}

            <div>

              <label className="mb-2 block text-sm font-medium text-stone-700">
                Password
              </label>

              <div className="relative">
              <Input
                type={showPassword? "text" : "password"}
                placeholder="••••••••"
                className="pr-10"
                {...register("password")}
              />

              <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex 
              items-center text-stone-400 hover:text-stone-600 cursor-pointer select-none"
              aria-label={showPassword ? "Hide Password " : "Show Password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5"/>
                ):(
                  <Eye className="h-5 w-5" />
                )}
              </button>

              </div>

              
            </div>

            <Button
              type="submit"
              className="w-full  cursor-pointer "
            >
              Sign In
            </Button>          



          </form>

          <div className="mt-6 border-t border-stone-200 pt-5 text-center">

            <p className="text-sm text-stone-500">

              Don't have an account?{" "}

              <button
                onClick={() => router.push("/signup")}
                className="font-semibold text-blue-600 transition hover:text-blue-700 cursor-pointer "
              >
                Sign Up
              </button>

            </p>

          </div>



        </AuthCard>

      </div>

    </div>
  );
}