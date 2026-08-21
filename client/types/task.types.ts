import { Project } from "./project.types";

export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "DONE";

export type TaskPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export interface TaskUser {
  id: string;
  name: string;
  avatar?: string | null;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;

  creatorId: string;
  creator: TaskUser;

  assignToId?: string | null;
  assignTo?: TaskUser | null;

  projectId: string;
  project: Project;

  createdAt: string;
  updatedAt: string;
}

export type GetTasksResponse = {
  tasks: Task[];

  page: number;

  limit: number;

  total: number;

  totalPages: number;
};