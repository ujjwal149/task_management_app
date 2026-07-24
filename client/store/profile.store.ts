import { create } from "zustand";

import { useAuthStore } from "./auth.store";

import {
  getProfile,
  updateProfile,
  uploadAvatar as uploadAvatarService,
} from "@/services/profile.service";

type Profile = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: "ADMIN" | "USER";
};

type ProfileStore = {
  profile: Profile | null;

  loading: boolean;

  fetchProfile: () => Promise<void>;

  updateName: (
    name: string
  ) => Promise<void>;

  uploadAvatar: (
  file: File
) => Promise<void>;

};

export const useProfileStore =
create<ProfileStore>((set) => ({

  profile: null,

  loading: false,

  fetchProfile: async () => {

    set({
      loading: true,
    });

    try {

      const profile =
        await getProfile();

      set({
        profile,
      });

    } finally {

      set({
        loading: false,
      });

    }

  },

  updateName: async (name) => {
  const response = await updateProfile(name);

  set({
    profile: response.user,
  });

  useAuthStore
    .getState()
    .setUser(response.user);
  },

  uploadAvatar: async (file) => {
  const response =
    await uploadAvatarService(file);

  set({
    profile: response.user,
  });

  useAuthStore
    .getState()
    .setUser(response.user);
},

}));