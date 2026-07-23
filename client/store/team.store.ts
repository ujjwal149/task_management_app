import { create } from "zustand";

import { TeamMember } from "@/types/team.type";

import {
  getProjectMembers,
} from "@/services/team.service";

type TeamStore = {

  members: TeamMember[];

  loading: boolean;

  fetchMembers: (
    projectId: string
  ) => Promise<void>;

  clearMembers: () => void;

};

export const useTeamStore =
create<TeamStore>((set) => ({

  members: [],

  loading: false,

  fetchMembers: async (
    projectId
  ) => {

    set({
      loading: true,
    });

    try {

      const data =
        await getProjectMembers(
          projectId
        );

      set({
        members: data.members,
      });

    } finally {

      set({
        loading: false,
      });

    }

  },

  clearMembers: () =>
    set({
      members: [],
    }),

}));