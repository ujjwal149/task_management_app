export type DashboardOverview = {
  totalTasks: number;
  completed: number;
  todo: number;
  inProgress: number;
  overdue: number;
  completionRate: number;
};

export type StatusDistribution = {
  status: "TODO" | "IN_PROGRESS" | "DONE";
  count: number;
};

export type PriorityDistribution = {
  priority: "LOW" | "MEDIUM" | "HIGH";
  count: number;
};

export type WeeklyActivity = {
  day: string;
  tasks: number;
};

export type DashboardResponse = {
  overview: DashboardOverview;

  statusDistribution: StatusDistribution[];

  priorityDistribution: PriorityDistribution[];

  weeklyActivity: WeeklyActivity[];
};