"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { useProjectStore } from "@/store/project.store";

type Props = {
  open: boolean;
  onClose: () => void;
};

type FormValues = {
  name: string;
  description?: string;
  color?: string;
};

const COLORS = [
  "#2563EB",
  "#16A34A",
  "#9333EA",
  "#EA580C",
  "#DC2626",
  "#525252",
];

export default function EditProjectModal({
  open,
  onClose,
}: Props) {
  const {
    currentProject,
    updateProject,
  } = useProjectStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<FormValues>();

  useEffect(() => {
    if (!currentProject) return;

    reset({
      name: currentProject.name,
      description: currentProject.description ?? "",
      color: currentProject.color ?? "#2563EB",
    });
  }, [currentProject, reset]);

  const selectedColor = watch("color");

  const onSubmit = async (
    data: FormValues
  ) => {
    if (!currentProject) return;

    try {
      await updateProject(currentProject.id, data);

      toast.success(
        "Project updated successfully."
      );

      onClose();

    } catch {

      toast.error(
        "Failed to update project."
      );

    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Project"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div>
          <label className="mb-2 block text-sm font-medium">
            Project Name
          </label>

          <Input
            {...register("name")}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Description
          </label>

          <textarea
            rows={4}
            {...register("description")}
            className="
              w-full
              rounded-xl
              border
              border-stone-300
              px-4
              py-3
              outline-none
              focus:border-blue-600
            "
          />
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium">
            Project Color
          </label>

          <div className="flex gap-3">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() =>
                  setValue("color", color)
                }
                className={`
                  h-10
                  w-10
                  rounded-full
                  border-4
                  transition
                  ${
                    selectedColor === color
                      ? "border-stone-900 scale-110"
                      : "border-transparent"
                  }
                `}
                style={{
                  background: color,
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">

          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button type="submit">
            Save Changes
          </Button>

        </div>
      </form>
    </Modal>
  );
}