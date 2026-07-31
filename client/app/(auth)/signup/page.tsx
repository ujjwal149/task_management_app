"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthCard from "@/components/ui/AuthCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import {signupSchema,SignUpFormData,} from "@/validations/auth.schema";

import { signup } from "@/services/auth.service"
import { useAuth } from  "@/hooks/useAuth";

import GoogleSignButton from "@/components/auth/GoogleSignButton";
import Divider from "@/components/auth/Divider";

export default function SignUpPage(){
  const router = useRouter();

  const {user,loading,setUser} = useAuth();

  useEffect(() => {
    if(!loading && user){
      router.replace("/dashboard");
    }
  },[loading,user,router]);


  const {register,handleSubmit,formState:{errors},}
        = useForm<SignUpFormData>({resolver: zodResolver(signupSchema),});

  const onSubmit = async(data: SignUpFormData ) => {
    try{
      const response = await signup(data);

      setUser(response.user);
      

      router.replace("/dashboard");
    }catch(error: any){
      console.log(error.response?.data);
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
        <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        >

          {/*Name*/}
          <div>
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
          <Button className="cursor-pointer" type="submit" >
            Sign Up
          </Button>
        </form>
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