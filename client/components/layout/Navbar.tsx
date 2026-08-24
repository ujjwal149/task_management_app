"use client";

import { Menu, Plus, Search } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/store/ui.store";

import { useEffect,useState } from "react";

import { useTaskStore } from "@/store/task.store";

import NotificationCenter
  from "@/components/notifications/NotificationCenter";

import UserDropdown from "./UserDropdown";

export default function Navbar() {

  const {
  toggleSidebar,
  openCreateTaskModal,
  } = useUIStore();

  const {
    setSearchQuery,
  } = useTaskStore();

  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, setSearchQuery]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stone-200 bg-white px-4 md:px-8">

      {/* Left */}

      <div className="flex items-center gap-4">

        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 transition hover:bg-stone-100 md:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="relative hidden md:block md:w-90">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />

          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
          />

        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-3 md:gap-5">

        <NotificationCenter />

        <button
          onClick={openCreateTaskModal}
          className="hidden items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium cursor-pointer text-white transition hover:bg-blue-700 md:flex"
        >
          <Plus size={18} />
          New Task
        </button>

        <UserDropdown />

      </div>

    </header>
  );
}