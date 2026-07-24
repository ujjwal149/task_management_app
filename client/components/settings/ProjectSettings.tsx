"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { useProjectStore } from "@/store/project.store";

import EditProjectModal from "./EditProjectModal";

import DeleteProjectModal from "./DeleteProjectModal";

export default function ProjectSettings() {
  const [open, setOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] =
  useState(false);

  const currentProject =
    useProjectStore(
      (state) => state.currentProject
    );

  if (!currentProject) return null;

  return (
    <>
      <div className="rounded-2xl bg-white p-8 shadow-sm">

        <div className="mb-8">

          <h2 className="text-2xl font-bold">
            Project Settings
          </h2>

          <p className="mt-1 text-stone-500">
            Manage your current workspace.
          </p>

        </div>

        <div className="space-y-8">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-stone-500">
                Project Name
              </p>

              <p className="mt-2 text-lg">
                {currentProject.name}
              </p>

            </div>

            <button
              onClick={() => setOpen(true)}
              className="rounded-lg border border-stone-300 px-4 py-2 hover:bg-stone-100"
            >
              <Pencil size={16} />
            </button>

          </div>

          <div>

            <p className="text-sm font-medium text-stone-500">
              Description
            </p>

            <p className="mt-2">
              {currentProject.description ||
                "No description"}
            </p>

          </div>

          <div>

            <p className="text-sm font-medium text-stone-500">
              Project Color
            </p>

            <div
              className="mt-3 h-8 w-8 rounded-full border"
              style={{
                background: currentProject.color ?? "#2563EB",
              }}
            />

          </div>

          <hr className="my-8" />

          <div>
                      
            <h3 className="text-lg font-semibold text-red-600">
              Danger Zone
            </h3>
                      
            <p className="mt-2 text-sm text-stone-500">
              Delete this project permanently.
              This action cannot be undone.
            </p>
                      
            <button
              onClick={() => setDeleteOpen(true)}
              className="
                mt-6
                rounded-xl
                border
                border-red-300
                px-5
                py-3
                font-medium
                text-red-600
                transition
                hover:bg-red-50
              "
            >
              Delete Project
            </button>
                      
          </div>

        </div>

      </div>

      <EditProjectModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}