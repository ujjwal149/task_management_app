"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import {
  createProjectSchema,
  CreateProjectInput,
} from "@/validations/project.schema";

import { useProjects } from "@/hooks/useProject";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateProjectModal({
  open,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);

  const {
    createProject,
    fetchProjects,
  } = useProjects();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
  });

  if (!open) return null;

 const onSubmit = async (
  data: CreateProjectInput
) => {
  try {

    setLoading(true);

    await createProject(data);

    toast.success("Project created successfully.");

    reset();

    onClose();

  } catch (error) {

    console.error(error);

    toast.error("Failed to create project.");

  } finally {

    setLoading(false);

  }
};

  return (
    <div
      className="  fixed  inset-0  z-50  flex  items-center  justify-center  bg-black/40  backdrop-blur-sm"
    >
      <div
        className="  w-full  max-w-lg  rounded-2xl  bg-white  p-6 mx-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-xl font-bold">
            Create Project
          </h2>

          <button onClick={onClose}>
            <X size={20} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div>

            <label className="mb-2 block text-sm font-medium">
              Project Name
            </label>

            <input
              {...register("name")}
              placeholder="My Awesome Project"
              className="  w-full  rounded-lg  border  border-stone-300  px-4  py-3  outline-none  focus:border-blue-500"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.name.message}
              </p>
            )}

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              {...register("description")}
              rows={4}
              placeholder="Write something..."
              className="  w-full  rounded-lg  border  border-stone-300  px-4  py-3  outline-none  focus:border-blue-500"
            />

            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}

          </div>

          <button
            disabled={loading}
            className="  w-full  rounded-xl  bg-blue-600  py-3 
                   cursor-pointer  font-semibold  text-white  transition
                     hover:bg-blue-700  disabled:opacity-60"
            >
            {loading
              ? "Creating..."
              : "Create Project"}
          </button>

        </form>
      </div>
    </div>
  );
}