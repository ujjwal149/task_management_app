"use client";

import AvatarUploader from "./AvatarUploader";
import EditableName from "./EditableName";

import { useAuthStore } from "@/store/auth.store";

export default function ProfileCard() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">

      {/* Header */}

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-stone-900">
          Profile
        </h2>

        <p className="mt-1 text-stone-500">
          Manage your account information.
        </p>

      </div>

      <div className="space-y-10">

        {/* Avatar */}

        <AvatarUploader />

        {/* Name */}

        <EditableName
          name={user.name}
        />

        {/* Email */}

        <div>

          <p className="text-sm font-medium text-stone-500">
            Email
          </p>

          <div className="mt-2 flex items-center justify-between">

            <p className="text-lg font-medium text-stone-900">
              {user.email}
            </p>

            <span className="rounded-lg bg-stone-100 px-3 py-1 text-sm font-medium text-stone-500">
              Read Only
            </span>

          </div>

        </div>

        {/* Role */}

        <div>

          <p className="text-sm font-medium text-stone-500">
            Role
          </p>

          <div className="mt-2 flex items-center justify-between">

            <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
              {user.role}
            </span>

            <span className="rounded-lg bg-stone-100 px-3 py-1 text-sm font-medium text-stone-500">
              Read Only
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}