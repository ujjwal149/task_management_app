"use client";

import { useForm } from "react-hook-form";

import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type InviteForm = {
  email: string;
  role: "ADMIN" | "MEMBER";
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function InviteMemberModal({
  open,
  onClose,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<InviteForm>({
    defaultValues: {
      role: "MEMBER",
    },
  });

  const onSubmit = async (data: InviteForm) => {
    console.log(data);

    // Backend API here later

    reset();

    onClose();
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

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Role
          </label>

          <select
            {...register("role")}
            className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-blue-600"
          >
            <option value="MEMBER">
              Member
            </option>

            <option value="ADMIN">
              Admin
            </option>
          </select>
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
            Invite
          </Button>

        </div>
      </form>
    </Modal>
  );
}