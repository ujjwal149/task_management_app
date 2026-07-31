"use client";

import { useRouter } from "next/navigation";

import { useEffect, useRef, useState } from "react";
import {ChevronDown,LogOut,Settings,User,} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/hooks/useLogout";



export default function UserDropdown() {

  const router = useRouter();

const { user } = useAuth();

  const [open, setOpen] = useState(false);

  

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const logout = useLogout();

  return (
    <div
      className="relative"
      ref={dropdownRef}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-stone-100 cursor-pointer"
      >
        <div className="h-10 w-10 overflow-hidden rounded-full border border-stone-200 ">

          <img
            src={
              user?.avatar ??
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name ?? "User"
              )}`
            }
            alt={user?.name}
            className="h-full w-full object-cover"
          />

        </div>

        <ChevronDown size={18} />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-stone-200 bg-white shadow-xl">

          <div className="border-b border-stone-200 p-4">

            <div className="flex items-center gap-3  p-4">

              <img
                src={
                  user?.avatar ??
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name ?? "User"
                  )}`
                }
                alt={user?.name}
                className="h-12 w-12 rounded-full object-cover"
              />

              <div>
              
                <p className="font-semibold text-stone-900">
                  {user?.name}
                </p>
              
                <p className="text-sm text-stone-500">
                  {user?.email}
                </p>
              
                <p className="mt-1 text-xs font-medium text-blue-600">
                  {user?.role}
                </p>
              
              </div>
              
            </div>

          </div>

          <button
            onClick={() => {
              setOpen(false);
              router.push("/settings");
            }}
            className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-stone-50"
          >
            <User size={18} />
            My Profile
          </button>

          <button
            onClick={() => {
              setOpen(false);
              router.push("/settings");
            }}
            className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-stone-50"
          >
            <Settings size={18} />
            Settings
          </button>

          <button
            onClick={async () => {
              setOpen(false);
              await logout();
            }}
            className="flex w-full items-center gap-3 px-5 py-3 text-left text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>
      )}
    </div>
  );
}