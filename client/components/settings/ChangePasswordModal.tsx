"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { updatePassword } from "@/services/user.service";

type FormData = {
  currentPassword: string;
  newPassword: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ChangePasswordModal({
  open,
  onClose,
}: Props) {

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {

      const response =
        await updatePassword(data);

      toast.success(response.message);

      reset();

      onClose();

    } catch (error: any) {

      toast.error(
        error.response?.data?.message ??
        "Failed to update password."
      );

    }
  };

  return (
    <Modal
      open={open}
      title="Change Password"
      onClose={onClose}
    >

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >

        <div>

          <label className="mb-2 block text-sm font-medium">
            Current Password
          </label>

          <Input
            type="password"
            {...register("currentPassword")}
          />

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">
            New Password
          </label>

          <Input
            type="password"
            {...register("newPassword")}
          />

        </div>

        <div className="flex justify-end gap-3">

          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Updating..."
              : "Update Password"}
          </Button>

        </div>

      </form>

    </Modal>
  );
}