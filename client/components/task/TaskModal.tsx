"use client";

import { useState, useEffect } from "react";

import { useProjects } from "@/hooks/useProject";
import { useTeamStore } from "@/store/team.store";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import DateTimePicker from "@/components/ui/DateTimePicker";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createTaskSchema,
  CreateTaskInput,
} from "@/validations/task.schema";

import {
  createTask,
  updateTask,
} from "@/services/task.service";

import { useTaskStore } from "@/store/task.store";

import { Task } from "@/types/task.types";

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
  const [submitting, setSubmitting] = useState(false);

  const [selectedDate, setSelectedDate] =
    useState<Date | null>(null);

  const isEditing = Boolean(task);

  const {
    projects,
    fetchProjects,
    currentProject,
  } = useProjects();

  const {
    members,
    fetchMembers,
    loading: membersLoading,
  } = useTeamStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      dueDate: "",
      projectId: "",
      assignToId: "",
    },
  });

  const selectedProjectId = watch("projectId");

  /*
   * Fetch projects when modal opens
   */
  useEffect(() => {
    if (!open) return;

    fetchProjects();
  }, [open, fetchProjects]);

  /*
   * Load project members whenever the selected
   * project changes.
   */
  useEffect(() => {
    if (!open) return;

    if (selectedProjectId) {
      fetchMembers(selectedProjectId);
    }
  }, [
    open,
    selectedProjectId,
    fetchMembers,
  ]);

  /*
   * Populate form when editing.
   * Reset form when creating.
   */
  useEffect(() => {
    if (!open) return;

    if (task) {
      const due = task.dueDate
        ? new Date(task.dueDate)
        : null;

      setSelectedDate(due);

      reset({
        title: task.title,

        description:
          task.description ?? "",

        priority: task.priority,

        dueDate:
          due
            ? due.toISOString()
            : "",

        projectId:
          task.projectId,

        assignToId:
          task.assignToId ?? "",
      });
    } else {
      setSelectedDate(null);

      reset({
        title: "",

        description: "",

        priority: "MEDIUM",

        dueDate: "",

        projectId:
          currentProject?.id ??
          "",

        assignToId: "",
      });
    }
  }, [
    open,
    task,
    currentProject,
    reset,
  ]);

  const onSubmit = async (
    data: CreateTaskInput
  ) => {
    if (submitting) return;

    /*
     * Extra protection before sending the request.
     */
    if (!data.assignToId) {
      toast.error(
        "Please select a user to assign the task."
      );

      return;
    }

    try {
      setSubmitting(true);

      /*
       * CREATE
       */
      if (!isEditing) {
        const response =
          await createTask({
            ...data,

            /*
             * assignById is intentionally NOT sent.
             *
             * Backend knows who is creating the task
             * from req.user.userId.
             */
          });

        useTaskStore
          .getState()
          .addTask(response.task);

        await useTaskStore
          .getState()
          .fetchTasks();

        toast.success(
          "Task created successfully."
        );
      }

      /*
       * UPDATE
       */
      else if (task) {
        const response =
          await updateTask(
            task.id,
            data
          );

        useTaskStore
          .getState()
          .updateTask(response.task);

        toast.success(
          "Task updated successfully."
        );
      }

      /*
       * Reset after successful operation.
       */
      reset({
        title: "",
        description: "",
        priority: "MEDIUM",
        dueDate: "",
        projectId: "",
        assignToId: "",
      });

      setSelectedDate(null);

      onClose();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ??
          "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={
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
        {/* TITLE  */}

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

        {/* DESCRIPTION */}

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Description
          </label>

          <textarea
            rows={4}
            placeholder="Task description..."
            {...register("description")}
            className="
              w-full
              rounded-xl
              border
              border-stone-300
              px-4
              py-3
              outline-none
              transition
              focus:border-blue-600
            "
          />

          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* PROJECT  */}

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Project
          </label>

          <select
            {...register("projectId")}
            className="
              w-full
              rounded-xl
              border
              border-stone-300
              px-4
              py-3
              outline-none
              transition
              focus:border-blue-600
            "
          >
            <option value="">
              Select Project
            </option>

            {projects.map((project) => (
              <option
                key={project.id}
                value={project.id}
              >
                {project.name}
              </option>
            ))}
          </select>

          {errors.projectId && (
            <p className="mt-1 text-sm text-red-500">
              {errors.projectId.message}
            </p>
          )}
        </div>

        {/* ASSIGN TO*/}

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Assign To
          </label>

          <select
            {...register("assignToId")}
            disabled={
              !selectedProjectId ||
              membersLoading
            }
            className="
              w-full
              rounded-xl
              border
              border-stone-300
              px-4
              py-3
              outline-none
              transition
              focus:border-blue-600
              disabled:cursor-not-allowed
              disabled:bg-stone-100
            "
          >
            <option value="">
              {!selectedProjectId
                ? "Select project first"
                : membersLoading
                ? "Loading members..."
                : "Select user"}
            </option>

            {members.map((member) => (
              <option
                key={member.user.id}
                value={member.user.id}
              >
                {member.user.name}{" "}
                ({member.user.email})
              </option>
            ))}
          </select>

          {errors.assignToId && (
            <p className="mt-1 text-sm text-red-500">
              {errors.assignToId.message}
            </p>
          )}

          {!membersLoading &&
            selectedProjectId &&
            members.length === 0 && (
              <p className="mt-1 text-sm text-stone-500">
                No members found in this project.
              </p>
            )}
        </div>

        {/* ================= PRIORITY ================= */}

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Priority
          </label>

          <select
            {...register("priority")}
            className="
              w-full
              rounded-xl
              border
              border-stone-300
              px-4
              py-3
              outline-none
              transition
              focus:border-blue-600
            "
          >
            <option value="LOW">
              Low
            </option>

            <option value="MEDIUM">
              Medium
            </option>

            <option value="HIGH">
              High
            </option>
          </select>

          {errors.priority && (
            <p className="mt-1 text-sm text-red-500">
              {errors.priority.message}
            </p>
          )}
        </div>

        {/* ================= DUE DATE ================= */}

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Due Date
          </label>

          <DateTimePicker
            value={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);

              setValue(
                "dueDate",
                date
                  ? date.toISOString()
                  : "",
                {
                  shouldValidate: true,
                }
              );
            }}
          />

          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-500">
              {errors.dueDate.message}
            </p>
          )}
        </div>

        {/* ================= FOOTER ================= */}

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              reset();

              setSelectedDate(null);

              onClose();
            }}
            disabled={submitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={
              submitting ||
              membersLoading
            }
          >
            {submitting
              ? isEditing
                ? "Saving..."
                : "Creating..."
              : isEditing
              ? "Save Changes"
              : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}