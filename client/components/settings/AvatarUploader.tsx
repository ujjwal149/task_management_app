"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import toast from "react-hot-toast";



import { useAuthStore } from "@/store/auth.store";
import { useProfileStore } from "@/store/profile.store";



export default function AvatarUploader() {
  const inputRef = useRef<HTMLInputElement>(null);

  const user = useAuthStore((state) => state.user);

  const uploadAvatar =
    useProfileStore((state) => state.uploadAvatar);

  const [uploading, setUploading] = useState(false);

  const handleChooseImage = () => {
    inputRef.current?.click();
  };

  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      await uploadAvatar(file);

      toast.success("Avatar updated successfully.");
    } catch (error) {
      console.error(error);

      toast.error("Failed to upload avatar.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-6">

      <div className="relative">

        <button
          type="button"
          onClick={handleChooseImage}
          className="group relative h-24 w-24 overflow-hidden rounded-full border-4 border-stone-200"
        >
          <img
            src={
              user?.avatar ??
              "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(user?.name ?? "User")
            }
            alt="Avatar"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">

            {uploading ? (
              <Loader2
                size={24}
                className="animate-spin text-white"
              />
            ) : (
              <Camera
                size={22}
                className="text-white"
              />
            )}

          </div>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleUpload}
        />

      </div>

      <div>

        <h3 className="text-lg font-semibold text-stone-900">
          Profile Photo
        </h3>

        <p className="mt-1 text-sm text-stone-500">
          JPG, PNG or WEBP.
          Maximum size 5 MB.
        </p>

      </div>

    </div>
  );
}