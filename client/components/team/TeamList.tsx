"use client";

import { useState } from "react";
import { Plus, Users } from "lucide-react";

import InviteMemberModal from "./InviteMemberModal";
import Button from "@/components/ui/Button";

export default function TeamList() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="rounded-2xl bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold text-stone-900">
              Team Members
            </h1>

            <p className="mt-1 text-stone-500">
              Manage your workspace members.
            </p>
          </div>

          <Button onClick={() => setOpen(true)}>
            <Plus size={18} />
            Invite Member
          </Button>

        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 py-20">

          <Users size={48} className="mb-4 text-stone-400" />

          <h2 className="text-lg font-semibold">
            No Team Members Yet
          </h2>

          <p className="mt-2 text-sm text-stone-500">
            Invite members to collaborate.
          </p>

        </div>

      </div>

      <InviteMemberModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}