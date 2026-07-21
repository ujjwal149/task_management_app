"use client";

import {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger";

type ButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    loading?: boolean;
    fullWidth?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
  };

export default function Button({
  children,
  className = "",
  variant = "primary",
  loading = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: ButtonProps) {

  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

  const width =
    fullWidth ? "w-full" : "";

  const variants = {

    primary:
      "bg-blue-600 text-white hover:bg-blue-700",

    secondary:
      "bg-stone-200 text-stone-800 hover:bg-stone-300",

    danger:
      "bg-red-600 text-white hover:bg-red-700",

  };

  return (

    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${width} ${variants[variant]} ${className}`}
      {...props}
    >

      {loading ? (

        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

      ) : (

        <>
          {leftIcon}

          {children}

          {rightIcon}
        </>

      )}

    </button>

  );

}