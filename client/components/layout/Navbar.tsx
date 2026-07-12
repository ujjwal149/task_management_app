"use client";

import { Bell, Menu, Plus, Search } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/store/ui.store";

import UserDropdown from "./UserDropdown";

export default function Navbar() {
  const { user } = useAuth();

  const { toggleSidebar } = useUIStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stone-200 bg-white px-4 md:px-8">

      {/* Left Section */}

      <div className="flex items-center gap-4">

        {/* Mobile Hamburger */}

        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 transition hover:bg-stone-100 md:hidden"
        >
          <Menu size={22} />
        </button>

        {/* Search */}

        <div className="relative hidden md:block md:w-96">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
          />

        </div>

      </div>

      {/* Right Section */}

      <div className="flex items-center gap-3 md:gap-5">

        {/* Notification */}

        <button className="rounded-xl p-2 text-stone-600 transition hover:bg-stone-100">
          <Bell size={20} />
        </button>

        {/* New Task */}

        <button className="hidden items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 md:flex">

          <Plus size={18} />

          New Task

        </button>

        {/* Avatar */}

        <UserDropdown />

      </div>

    </header>
  );
}