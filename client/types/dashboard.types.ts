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

export type DashboardPeriod =
  | "today"
  | "week"
  | "month"
  | "year";

export type UpcomingDeadline = {
  id: string;
  title: string;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
};

export type RecentTask = {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  createdAt: string;
};

export type RecentActivity = {
  id: string;

  title: string;

  status: "TODO" | "IN_PROGRESS" | "DONE";

  updatedAt: string;
};

export type DashboardResponse = {
  overview: DashboardOverview;

  statusDistribution: StatusDistribution[];

  priorityDistribution: PriorityDistribution[];

  weeklyActivity: WeeklyActivity[];

  upcomingDeadlines: UpcomingDeadline[];

  recentTasks: RecentTask[];

  recentActivity: RecentActivity[];
};