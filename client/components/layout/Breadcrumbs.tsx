"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean);

  return (
    <div className="mb-6 flex items-center gap-2 text-sm text-stone-500">

      <Link
        href="/dashboard"
        className="hover:text-blue-600"
      >
        Home
      </Link>

      {segments.map((segment, index) => (
        <div
          key={index}
          className="flex items-center gap-2"
        >
          <ChevronRight size={15} />

          <span className="capitalize text-stone-700">
            {segment}
          </span>
        </div>
      ))}

    </div>
  );
}