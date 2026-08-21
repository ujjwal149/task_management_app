"use client";

import { FolderKanban, Pencil, Trash2 } from "lucide-react";

import { Project } from "@/types/project.types";

type ProjectCardProps = {
  project: Project;

  onEdit: (project: Project) => void;

  onDelete: (project: Project) => void;
};

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-stone-200
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div
            className="h-5 w-5 rounded-full border"
            style={{
              backgroundColor:
                project.color || "#2563EB",
            }}
          />

          <h3 className="text-lg font-semibold text-stone-900">
            {project.name}
          </h3>

        </div>

        <FolderKanban
          className="text-stone-400"
          size={22}
        />

      </div>

      {/* Description */}

      <p className="mt-4 min-h-12 text-sm leading-6 text-stone-600">
        {project.description ||
          "No description provided."}
      </p>

      {/* Footer */}

      <div className="mt-6 flex items-center justify-between">

        <div>

          <span className="text-xs text-stone-400">
                
            {project._count.tasks ?? 0}
                
            {(project._count.tasks ?? 0) === 1
              ? " Task"
              : " Tasks"}
        
          </span>
            
          <p className="mt-1 text-xs text-stone-400">
            
            Created{" "}
            {new Date(project.createdAt).toLocaleDateString()}
            
          </p>
            
        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={() => onEdit(project)}
            className="
              rounded-lg
              p-2
              text-blue-600
              transition-colors
              hover:bg-blue-50
            "
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onDelete(project)}
            className="
              rounded-lg
              p-2
              text-red-600
              transition-colors
              hover:bg-red-50
            "
          >
            <Trash2 size={18} />
          </button>

        </div>

      </div>

    </div>
  );
}