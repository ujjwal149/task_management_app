"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthCard from "@/components/ui/AuthCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import {
  signInSchema,
  SignInFormData,
} from "@/validations/auth.schema";

import {signin} from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

import { useRouter } from "next/navigation";

export default function SignInPage() {

  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

const onSubmit = async (data: SignInFormData) => {
  try {
    const response = await signin(data);

    useAuthStore.getState().setUser(response.user);

    router.replace("/dashboard");
    
  } catch (error: any) {
    console.log(error.response?.data);
  }
};



  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <AuthCard title="Sign In">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Email */}
          <div>
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

          {/* Password */}
          <div>
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

          <Button type="submit">
            Sign In
          </Button>
        </form>
      </AuthCard>
    </div>
  );
}