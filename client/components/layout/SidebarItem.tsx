"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { useUIStore } from "@/store/ui.store";

type SidebarItemProps = {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
};

export default function SidebarItem({
  href,
  icon: Icon,
  children,
}: SidebarItemProps) {
  const pathname = usePathname();
  
  const { closeSidebar} = useUIStore();

  const active = pathname === href;

  return (
    <Link
      href={href}
      onClick={closeSidebar}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-blue-600 text-white shadow-sm"
          : "text-stone-700 hover:bg-blue-50 hover:text-blue-600"
      }`}
    >
      <Icon size={20} />

      <span>{children}</span>
    </Link>
  );
}