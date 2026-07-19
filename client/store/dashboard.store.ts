import { create } from "zustand";

import {
  DashboardOverview,
  DashboardResponse,
  StatusDistribution,
  PriorityDistribution,
  WeeklyActivity,
} from "@/types/dashboard.types";

import {
  getDashboardAnalytics,
} from "@/services/dashboard.service";

type DashboardStore = {

  overview: DashboardOverview | null;

  statusDistribution: StatusDistribution[];

  priorityDistribution: PriorityDistribution[];

  weeklyActivity: WeeklyActivity[];

  loading: boolean;

  fetchDashboard: () => Promise<void>;

  clearDashboard: () => void;
};

export const useDashboardStore =
create<DashboardStore>((set) => ({

  overview: null,

  statusDistribution: [],

  priorityDistribution: [],

  weeklyActivity: [],

  loading: false,

  fetchDashboard: async () => {

    set({
      loading: true,
    });

    try {

      const data: DashboardResponse =
        await getDashboardAnalytics();

      set({

        overview: data.overview,

        statusDistribution:
          data.statusDistribution,

        priorityDistribution:
          data.priorityDistribution,

        weeklyActivity:
          data.weeklyActivity,

      });

    } catch (error) {

      console.error(error);

    } finally {

      set({
        loading: false,
      });

    }

  },

  clearDashboard: () =>
    set({

      overview: null,

      statusDistribution: [],

      priorityDistribution: [],

      weeklyActivity: [],

      loading: false,

    }),

}));