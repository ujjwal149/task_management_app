import { ReactNode } from "react";

type AuthCardProps = {
  title?: string;
  children: ReactNode;
};

export default function AuthCard({
  title,
  children,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-xl bg-white-100 p-8 shadow-lg">
      <h1 className="mb-6 text-center text-2xl font-bold">
        {title}
      </h1>

      {children}
    </div>
  );
}