"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export default function Modal({
  open,
  title,
  children,
  onClose,
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="
          w-full
          max-w-lg
          rounded-2xl
          bg-white
          shadow-xl
          max-h-[90vh]
          overflow-hidden
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-4 py-4 sm:px-6 sm:py-5">
          <h2 className="text-lg font-semibold sm:text-xl">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-stone-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-4 sm:p-6 max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
}