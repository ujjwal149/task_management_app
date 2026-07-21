"use client";

import { useEffect, useState } from "react";

import { FolderKanban, Plus } from "lucide-react";

import CreateProjectModal from "./CreateProjectModal";

import { useProjects } from "@/hooks/useProject";

export default function ProjectSidebar() {
  const {
    projects,
    currentProject,
    setCurrentProject,
    fetchProjects,
  } = useProjects();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <>
      <aside
        className="
          sticky
          top-24
          h-[calc(100vh-8rem)]
          w-full
          rounded-2xl
          border
          border-stone-200
          bg-white
          shadow-sm
          overflow-hidden
        "
      >
        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-stone-200
            px-5
            py-4
          "
        >
          <div>

            <h2 className="text-xl font-semibold text-stone-900">
              Projects
            </h2>

            <p className="text-xs text-stone-500">
              {projects.length} Project
              {projects.length !== 1 && "s"}
            </p>

          </div>

          <button
            onClick={() => setOpen(true)}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-blue-600
              text-white
              transition
              hover:scale-105
              hover:bg-blue-700
            "
          >
            <Plus size={20} />
          </button>

        </div>

        {/* Project List */}

        <div
          className="
            h-[calc(100%-82px)]
            overflow-y-auto
            p-3
            space-y-2
          "
        >
          {projects.length === 0 ? (

            <div
              className="
                flex
                h-full
                flex-col
                items-center
                justify-center
                text-center
              "
            >

              <FolderKanban
                size={44}
                className="mb-3 text-stone-300"
              />

              <h3 className="font-semibold text-stone-700">
                No Projects
              </h3>

              <p className="mt-1 text-sm text-stone-500">
                Create your first project.
              </p>

            </div>

          ) : (

            projects.map((project) => (

              <button
                key={project.id}
                onClick={() => setCurrentProject(project)}
                className={`
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  border
                  p-3
                  transition-all
                  duration-200

                  ${
                    currentProject?.id === project.id
                      ? "border-blue-200 bg-blue-50 shadow-sm"
                      : "border-transparent hover:border-stone-200 hover:bg-stone-50"
                  }
                `}
              >

                <div
                  className="h-3.5 w-3.5 rounded-full border border-stone-300"
                  style={{
                    backgroundColor:
                      project.color || "#2563EB",
                  }}
                />

                <div className="min-w-0 flex-1">

                  <p
                    className="
                      truncate
                      text-left
                      font-medium
                      text-stone-800
                    "
                  >
                    {project.name}
                  </p>

                  {project.description && (

                    <p
                      className="
                        mt-1
                        truncate
                        text-xs
                        text-stone-500
                      "
                    >
                      {project.description}
                    </p>

                  )}

                </div>

              </button>

            ))

          )}

        </div>

      </aside>

      <CreateProjectModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}