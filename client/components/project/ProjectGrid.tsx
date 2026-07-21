"use client";

import { useEffect, useState } from "react";

import { FolderOpen } from "lucide-react";

import { useProjects } from "@/hooks/useProject";

import { Project } from "@/types/project.types";

import ProjectCard from "./ProjectCard";
import EditProjectModal from "./EditProjectModal";
import DeleteProjectDialog from "./DeleteProjectDialog";

export default function ProjectGrid() {

  const {

    projects,

    loading,

    fetchProjects,

  } = useProjects();

  const [editingProject, setEditingProject] =
    useState<Project | null>(null);

  const [deletingProject, setDeletingProject] =
    useState<Project | null>(null);

  useEffect(() => {

    fetchProjects();

  }, [fetchProjects]);

  if (loading) {

    return (

      <div className="py-20 text-center text-stone-500">

        Loading projects...

      </div>

    );

  }

  if (projects.length === 0) {

    return (

      <div
        className="
          flex
          flex-col
          items-center
          justify-center
          rounded-2xl
          border
          border-dashed
          border-stone-300
          bg-white
          py-20
        "
      >

        <FolderOpen
          size={48}
          className="mb-4 text-stone-400"
        />

        <h2 className="text-xl font-semibold text-stone-800">

          No Projects Yet

        </h2>

        <p className="mt-2 text-sm text-stone-500">

          Create your first project to organize your tasks.

        </p>

      </div>

    );

  }

  return (

    <>

      <div
        className="
          grid
          gap-6
          sm:grid-cols-2
          xl:grid-cols-3
        "
      >

        {projects.map((project) => (

          <ProjectCard

            key={project.id}

            project={project}

            onEdit={setEditingProject}

            onDelete={setDeletingProject}

          />

        ))}

      </div>

      {editingProject && (

        <EditProjectModal

          project={editingProject}

          open={true}

          onClose={() => setEditingProject(null)}

        />

      )}

      {deletingProject && (

        <DeleteProjectDialog

          project={deletingProject}

          open={true}

          onClose={() => setDeletingProject(null)}

        />

      )}

    </>

  );

}