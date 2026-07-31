"use client";

import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

import { Project } from "@/types/project.types";
import { useProjects } from "@/hooks/useProject";

type DeleteProjectDialogProps = {
  project: Project;
  open: boolean;
  onClose: () => void;
};

export default function DeleteProjectDialog({
  project,
  open,
  onClose,
}: DeleteProjectDialogProps) {

  const { deleteProject } = useProjects();

  const handleDelete = async () => {

    try {

      await deleteProject(project.id);

      toast.success("Project deleted successfully.");

      onClose();

    } catch (error) {

      console.error(error);

      toast.error("Failed to delete project.");

    }

  };

  return (

    <Modal
      open={open}
      title="Delete Project"
      onClose={onClose}
    >

      <div className="space-y-6 cursor-pointer">

        <div className="flex justify-center">

          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-red-100         
            "
          >

            <Trash2
              size={30}
              className="text-red-600"
            />

          </div>

        </div>

        <div className="text-center">

          <h3 className="text-lg font-semibold text-stone-900">

            Delete "{project.name}"?

          </h3>

          <p className="mt-2 text-sm text-stone-500">

            This action cannot be undone.

          </p>

        </div>

        <div className="flex justify-end gap-3">

          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={handleDelete}
          >
            Delete
          </Button>

        </div>

      </div>

    </Modal>

  );

}