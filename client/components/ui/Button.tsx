import { ButtonHTMLAttributes } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger";

type ButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
  };

export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {

  const baseStyles =
    "w-full rounded-lg px-4 py-3 font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

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
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}