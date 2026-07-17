"use client";

import {LayoutDashboard,CheckSquare,FolderKanban,Calendar,Users,Settings,LogOut,X} from "lucide-react";

import SidebarItem from "./SidebarItem";

import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/hooks/useLogout";
import { useUIStore } from "@/store/ui.store";

export default function Sidebar() {


const { user } = useAuth();

  const {
    sidebarOpen,
    closeSidebar,
  } = useUIStore();


  const logout = useLogout();


  return (
    <>
      {/* Mobile Overlay */}

      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar */}

      <aside
        className={`z-50 flex h-screen w-64 shrink-0 flex-col border-r border-stone-200 bg-stone-50
                   transition-transform duration-300 fixed left-0 top-0
                   ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    md:relative
                    md:translate-x-0
                    `}
      >
        {/* Logo */}

        <div className="flex items-center justify-between border-b border-stone-200 p-4">

          <h1 className="text-2xl font-bold text-blue-600">
            TaskFlow
          </h1>

          {/* Close Button */}

          <button
            onClick={closeSidebar}
            className="md:hidden"
          >
            <X size={22} />
          </button>

        </div>

        {/* Navigation */}

        <nav className="flex-1 space-y-2 p-4">

          <SidebarItem href="/dashboard" icon={LayoutDashboard}>
            Dashboard
          </SidebarItem>

          <SidebarItem href="/tasks" icon={CheckSquare}>
            Tasks
          </SidebarItem>

          <SidebarItem href="/projects" icon={FolderKanban}>
            Projects
          </SidebarItem>

          <SidebarItem href="/calendar" icon={Calendar}>
            Calendar
          </SidebarItem>

          <SidebarItem href="/teams" icon={Users}>
            Teams
          </SidebarItem>

          <SidebarItem href="/settings" icon={Settings}>
            Settings
          </SidebarItem>

        </nav>

        {/* Bottom */}

        <div className="border-t border-stone-200 p-4">

          <div className="mb-4">

            <p className="text-sm text-stone-500">
              Signed in as
            </p>

            <p className="font-semibold text-stone-900">
              {user?.name}
            </p>

          </div>

          <button
            onClick={async()=>{ await logout()}}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-stone-700 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={20} />
            Logout
          </button>

        </div>
      </aside>
    </>
  );
}