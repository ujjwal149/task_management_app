"use client";

import {
  forwardRef,
  InputHTMLAttributes,
} from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      className = "",
      required,
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-2">

        {label && (
          <label className="block text-sm font-medium text-stone-700">

            {label}

            {required && (
              <span className="ml-1 text-red-500">*</span>
            )}

          </label>
        )}

        <input
          ref={ref}
          required={required}
          className={` w-full rounded-lg border px-4 py-3 outline-none tran bg-white
             text-sto border-sto placeholder:text-sto focus:border-blue-500 focus:ring-2 focus:ring-bl 
             disabled:bg-stone-100 disabled:cursor-not-allowed

            ${error ? "border-red-500" : ""}

            ${className}
          `}
          {...props}
        />

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;