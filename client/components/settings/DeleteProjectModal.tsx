"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

import { useProjectStore } from "@/store/project.store";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function DeleteProjectModal({
  open,
  onClose,
}: Props) {
  const router = useRouter();

  const {
    currentProject,
    deleteProject,
  } = useProjectStore();

  const handleDelete = async () => {
    if (!currentProject) return;

    try {
      await deleteProject(currentProject.id);

      toast.success(
        "Project deleted successfully."
      );

      onClose();

      router.push("/projects");

    } catch {

      toast.error(
        "Failed to delete project."
      );

    }
  };

  if (!currentProject) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Project"
    >
      <div className="space-y-6">

        <div>

          <p className="text-stone-700">
            Are you sure you want to delete
          </p>

          <p className="mt-2 text-xl font-bold text-red-600">
            {currentProject.name}
          </p>

          <p className="mt-4 text-sm text-stone-500">
            This action cannot be undone.
            All project tasks will also be deleted.
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
            onClick={handleDelete}
          >
            Delete Project
          </Button>

        </div>

      </div>
    </Modal>
  );
}