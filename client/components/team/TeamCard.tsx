"use client";

import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { TeamMember } from "@/types/team.type";
import { removeMember } from "@/services/team.service";
import { useTeamStore } from "@/store/team.store";
import { useProjectStore } from "@/store/project.store";

type Props = {
  member: TeamMember;
};

export default function TeamCard({
  member,
}: Props) {
  const currentProject = useProjectStore(
    (state) => state.currentProject
  );

  const fetchMembers = useTeamStore(
    (state) => state.fetchMembers
  );

  const handleRemove = async () => {
    if (!currentProject) return;

    try {
      await removeMember(member.id);

      toast.success("Member removed.");

      await fetchMembers(currentProject.id);

    } catch (error: any) {
      toast.error(
        error.response?.data?.message ??
        "Failed to remove member."
      );
    }
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-5 shadow-sm">

      <div>
        <h3 className="font-semibold text-stone-900">
          {member.user.name}
        </h3>

        <p className="text-sm text-stone-500">
          {member.user.email}
        </p>
      </div>

      <div className="flex items-center gap-4">

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            member.role === "ADMIN"
              ? "bg-red-100 text-red-600"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          {member.role}
        </span>

        {member.role !== "ADMIN" && (
          <button
            onClick={handleRemove}
            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
          >
            <Trash2 size={18} />
          </button>
        )}

      </div>

    </div>
  );
}