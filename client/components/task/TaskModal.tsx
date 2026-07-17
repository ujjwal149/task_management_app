"use client";

import { useState,useEffect } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createTaskSchema, CreateTaskInput,} from "@/validations/task.schema";

import { createTask,updateTask} from "@/services/task.service";
import { useTaskStore } from "@/store/task.store";

import {Task} from "@/types/task.types";

import toast from "react-hot-toast";


  type TaskModalProps = {
    open: boolean;
    onClose: () => void;
    task?: Task;
  };

  export default function TaskModal({
    open,
    onClose,
    task,
    
  }: TaskModalProps) {

    const addTask = useTaskStore(
      (state) => state.addTask
    );

    const [submitting, setSubmitting] = useState(false);

    const isEditing = Boolean(task);

    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<CreateTaskInput>({
      resolver: zodResolver(createTaskSchema),
    });

    useEffect(() => {
      if(task) {
        reset({
          title: task.title,
          description: task.description ?? "",
          priority: task.priority,

          dueDate: 
                task.dueDate
                    ? new Date(task.dueDate)
                          .toISOString()
                          .slice(0,16)
                    : "",
        });
      }else{
        reset({
        title: "",
        description: "",
        priority: "MEDIUM",
        dueDate: "",
      });
      }
    },[task,reset]);

    const onSubmit = async (
  data: CreateTaskInput
) => {

  if (submitting) return;

  try {

    setSubmitting(true);

    if (isEditing && task) {

      const response = await updateTask(
        task.id,
        data
      );

      useTaskStore
        .getState()
        .updateTask(response.task);

      toast.success("Task updated");

    } else {

      const response =
        await createTask(data);

      addTask(response.task);

      toast.success("Task created");

    }

    reset({
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
    });

    onClose();

  } catch (error: any) {

    toast.error(
      error.response?.data?.message ??
      "Something went wrong."
    );

  } finally {

    setSubmitting(false);

  }
};

  return (
      <Modal
        open={open}
        title= {
          isEditing
          ? "Edit Task"
          : "Create New Task"
        }
        onClose={onClose}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >

          {/* Title */}

          <div>

            <label className="mb-2 block text-sm font-medium text-stone-700">
              Title
            </label>

            <Input
              type="text"
              placeholder="Task title"
              {...register("title")}
            />

            {errors.title && (
              <p className="mt-1 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}

          </div>

          {/* Description */}

          <div>

            <label className="mb-2 block text-sm font-medium text-stone-700">
              Description
            </label>

            <textarea
              rows={4}
              placeholder="Task description..."
              {...register("description")}
              className="  w-full  rounded-xl  border  border-stone-300  px-4  py-3  outline-none  transition  focus:border-blue-600"
            />

          </div>

          {/* Priority */}

          <div>

            <label className="mb-2 block text-sm font-medium text-stone-700">
              Priority
            </label>

            <select
              {...register("priority")}
              className="  w-full  rounded-xl  border  border-stone-300  px-4  py-3  outline-none  transition  focus:border-blue-600"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>

          </div>

          {/* Due Date */}

          <div>

            <label className="mb-2 block text-sm font-medium text-stone-700">
              Due Date
            </label>

            <Input
              type="datetime-local"
              {...register("dueDate")}
            />

          </div>

        

          {/* Footer */}

          <div className="flex justify-end gap-3 pt-2">

            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>

            <Button
             type="submit"
             disabled={submitting}
             >
              {submitting
              ? isEditing
                ? "Saving..."
                : "Creating.."
              : isEditing
                ? "Save Changes"
                : "Create Task"
              }
            </Button>

          </div>

      </form>
    </Modal>
  );
}