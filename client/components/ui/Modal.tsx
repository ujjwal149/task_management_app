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
      className=" fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm "
    >
      <div
        className=" relative w-full max-w-lg rounded-2xl bg-white shadow-2xl "
      >
        {/* Header */}

        <div
          className=" flex items-center justify-between border-b border-stone-200 px-6 py-5 "
        >
          <h2 className="text-xl font-semibold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className=" rounded-lg p-2 transition hover:bg-stone-100 "
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}

        <div className="p-6">

          {children}

        </div>

      </div>
    </div>
  );
}