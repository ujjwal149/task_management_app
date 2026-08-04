"use client";

import { useEffect, useState } from "react";
import { Plus, Users } from "lucide-react";

import Button from "@/components/ui/Button";

import InviteMemberModal from "./InviteMemberModal";
import TeamCard from "./TeamCard";

import { useProjectStore } from "@/store/project.store";
import { useTeamStore } from "@/store/team.store";

export default function TeamList() {
  const [open, setOpen] = useState(false);

  const currentProject = useProjectStore(
    (state) => state.currentProject
  );

  const {
    members,
    loading,
    fetchMembers,
  } = useTeamStore();

  useEffect(() => {
    if (currentProject) {
      fetchMembers(currentProject.id);
    }
  }, [currentProject, fetchMembers]);

    return (
      <>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              {/* Left */}
              <div>
                
                <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
                  Team Members
                </h1>
                
                <p className="mt-1 text-sm text-stone-500 sm:text-base">
                  Manage your project members.
                </p>
                
              </div>
                
              {/* Right */}
              <Button
                onClick={() => setOpen(true)}
                disabled={!currentProject}
                className="w-full justify-center sm:w-auto"
              >
                <Plus size={18} />
                Invite Member
              </Button>
                
            </div>
          {!currentProject ? (

            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 py-20">

              <Users
                size={48}
                className="mb-4 text-stone-400"
              />

              <h2 className="text-lg font-semibold">
                No Project Selected
              </h2>

              <p className="mt-2 text-sm text-stone-500">
                Select a project first.
              </p>

            </div>

          ) : loading ? (

            <div className="py-20 text-center text-stone-500">
              Loading...
            </div>

          ) : members.length === 0 ? (

            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 py-20">

              <Users
                size={48}
                className="mb-4 text-stone-400"
              />

              <h2 className="text-lg font-semibold">
                No Team Members
              </h2>

              <p className="mt-2 text-sm text-stone-500">
                Invite members to collaborate.
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {members.map((member) => (

                <TeamCard
                  key={member.id}
                  member={member}
                />

              ))}

            </div>

          )}

        

        <InviteMemberModal
          open={open}
          onClose={() => setOpen(false)}
        />
      </>
    );
  }