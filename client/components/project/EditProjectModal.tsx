"use client";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { Project } from "@/types/project.types";
import { useProjects } from "@/hooks/useProject";

type EditProjectModalProps = {
  project: Project;

  open: boolean;

  onClose: () => void;
};

export default function EditProjectModal({
  project,
  open,
  onClose,
}: EditProjectModalProps) {

  const { updateProject } = useProjects();

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [color, setColor] = useState("#2563EB");

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (project) {

      setName(project.name);

      setDescription(project.description || "");

      setColor(project.color || "#2563EB");

    }

  }, [project]);

  const handleSubmit = async () => {

    if (!name.trim()) {

      toast.error("Project name is required.");

      return;

    }

    try {

      setLoading(true);

      await updateProject(project.id, {

        name,

        description,

        color,

      });

      toast.success("Project updated successfully.");

      onClose();

    } catch (error) {

      console.error(error);

      toast.error("Failed to update project.");

    } finally {

      setLoading(false);

    }

  };

  return (

    <Modal
      open={open}
      onClose={onClose}
      title="Edit Project"
    >

      <div className="space-y-5">

        <Input
          label="Project Name"
          placeholder="Enter project name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <Input
          label="Description"
          placeholder="Enter description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <div>

          <label className="mb-2 block text-sm font-medium text-stone-700 ">

            Project Color

          </label>

          <input
            type="color"
            value={color}
            onChange={(e) =>
              setColor(e.target.value)
            }
            className="h-12 w-20 cursor-pointer rounded-lg border"
          />

        </div>

        <div className="flex justify-end gap-3 cursor-pointer">

          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            loading={loading}
            onClick={handleSubmit}
          >
            Save Changes
          </Button>

        </div>

      </div>

    </Modal>

  );

}