"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

import ChangePasswordModal from "./ChangePasswordModal";

export default function PasswordCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="rounded-2xl bg-white p-8 shadow-sm ">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-stone-900">
            Security
          </h2>

          <p className="mt-1 text-stone-500">
            Manage your password and account security.
          </p>
        </div>

        <div className="rounded-xl  p-6">

          <div className="flex items-start justify-between">

            <div className="flex gap-4 truncate">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 ">
                <Lock
                  size={22}
                  className="text-blue-600"
                />
              </div>

              <div>

                <h3 className="text-lg font-semibold text-stone-900">
                  Password
                </h3>

                <p className="mt-1 text-sm text-stone-500">
                  Last changed recently
                </p>

                <p className="mt-4 text-xl tracking-[0.45rem] text-stone-900">
                  ••••••••••••••••
                </p>

              </div>

            </div>

            <button
              onClick={() => setOpen(true)}
              className="  rounded-lg  border  border-stone-300  px-4  py-2  text-sm  font-medium  transition  hover:bg-stone-100  cursor-pointer"
            >
              Edit
            </button>

          </div>

        </div>

      </div>

      <ChangePasswordModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}