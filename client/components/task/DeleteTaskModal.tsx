"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

type DeleteTaskModalProps = {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteTaskModal({
  open,
  loading,
  onClose,
  onConfirm,
}: DeleteTaskModalProps) {
  return (
    <Modal
      open={open}
      title="Delete Task"
      onClose={onClose}
    >
      <div className="space-y-6">

        <p className="text-sm text-stone-600">
          Are you sure you want to delete this task?
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">

          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="button"
            className="bg-red-600 hover:bg-red-700"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>

        </div>

      </div>
    </Modal>
  );
}