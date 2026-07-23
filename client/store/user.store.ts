import { create } from "zustand";

import { User } from "@/types/user.type";

import {
  getUsers,
  updateUserRole,
  deleteUser,
} from "@/services/user.service";

type UserStore = {
  users: User[];
  loading: boolean;

  fetchUsers: () => Promise<void>;

  changeRole: (
    userId: string,
    role: "ADMIN" | "USER"
  ) => Promise<void>;

  removeUser: (
    userId: string
  ) => Promise<void>;
};

export const useUserStore =
create<UserStore>((set) => ({

  users: [],

  loading: false,

  fetchUsers: async () => {

    set({ loading: true });

    try {

      const data = await getUsers();

      set({
        users: data.users,
      });

    } finally {

      set({
        loading: false,
      });

    }

  },

  changeRole: async (
    userId,
    role
  ) => {

    const response =
      await updateUserRole(
        userId,
        role
      );

    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId
          ? response.user
          : user
      ),
    }));

  },

  removeUser: async (
    userId
  ) => {

    await deleteUser(userId);

    set((state) => ({
      users: state.users.filter(
        (user) =>
          user.id !== userId
      ),
    }));

  },

}));