"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { inviteMember } from "@/services/team.service";
import { useProjectStore } from "@/store/project.store";

type InviteForm = {
  email: string;
  role: "ADMIN" | "USER";
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function InviteMemberModal({
  open,
  onClose,
}: Props) {
  const currentProject = useProjectStore(
    (state) => state.currentProject
  );

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<InviteForm>({
    defaultValues: {
      role: "USER",
    },
  });

  const onSubmit = async (data: InviteForm) => {
    if (!currentProject) {
      toast.error("Please select a project first.");
      return;
    }

    try {
      const response = await inviteMember(
        data.email,
        data.role,
        currentProject.id
      );

      toast.success(response.message);

      reset({
        email: "",
        role: "USER",
      });

      onClose();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ??
          "Something went wrong."
      );
    }
  };

  return (
    <Modal
      open={open}
      title="Invite Team Member"
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* Email */}

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Email
          </label>

          <Input
            type="email"
            placeholder="member@example.com"
            {...register("email")}
          />
        </div>

        {/* Role */}

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Role
          </label>

          <select
            {...register("role")}
            className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-blue-600"
          >
            <option value="USER">
              Member
            </option>

            <option value="ADMIN">
              Admin
            </option>
          </select>
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button type="submit">
            Invite
          </Button>
        </div>
      </form>
    </Modal>
  );
}