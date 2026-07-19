import api from "@/lib/axios";

import {
  DashboardResponse,
} from "@/types/dashboard.types";

export const getDashboardAnalytics = async () => {

  const response =
    await api.get<DashboardResponse>(
      "/dashboard/analytics"
    );

  return response.data;
};