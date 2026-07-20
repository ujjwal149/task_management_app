import api from "@/lib/axios";

import { DashboardResponse, DashboardPeriod,} from "@/types/dashboard.types";



export const getDashboardAnalytics = async (period: DashboardPeriod) => {

  const response =
    await api.get<DashboardResponse>(`/dashboard/analytics?period=${period}`);

  return response.data;
};