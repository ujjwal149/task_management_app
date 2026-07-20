import { create } from "zustand";

import {
  DashboardOverview,
  DashboardResponse,
  StatusDistribution,
  PriorityDistribution,
  WeeklyActivity,
  DashboardPeriod,
  UpcomingDeadline,
  RecentTask,
  RecentActivity,
} from "@/types/dashboard.types";

import {getDashboardAnalytics,} from "@/services/dashboard.service";

type DashboardStore = {
  overview: DashboardOverview | null;

  statusDistribution: StatusDistribution[];

  priorityDistribution: PriorityDistribution[];

  weeklyActivity: WeeklyActivity[];

  upcomingDeadlines: UpcomingDeadline[];

  recentTasks: RecentTask[];

  recentActivity: RecentActivity[];

  loading: boolean;

  period: DashboardPeriod;

  setPeriod: (period: DashboardPeriod) => void;

  fetchDashboard: () => Promise<void>;

  clearDashboard: () => void;
};

export const useDashboardStore =
create<DashboardStore>((set, get) => ({

  overview: null,

  statusDistribution: [],

  priorityDistribution: [],

  weeklyActivity: [],

  upcomingDeadlines: [],

  recentTasks: [],

  recentActivity: [],

  loading: false,

  period: "week",

  setPeriod: (period) =>
    set({
      period,
    }),

  fetchDashboard: async () => {

    set({
      loading: true,
    });

    try {

      const period = get().period;

      const data: DashboardResponse =
        await getDashboardAnalytics(period);

      set({

        overview: 
          data.overview,

        statusDistribution:
          data.statusDistribution,

        priorityDistribution:
          data.priorityDistribution,

        weeklyActivity:
          data.weeklyActivity,

        upcomingDeadlines:
          data.upcomingDeadlines,

        recentTasks:
          data.recentTasks,

        recentActivity:
          data.recentActivity,

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

      upcomingDeadlines: [],

      recentTasks:[],

      recentActivity: [],

      loading: false,

      period: "week",

    }),

}));