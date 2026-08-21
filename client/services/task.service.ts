import api from "@/lib/axios";

import {
  GetTasksResponse,
  Task,
  TaskStatus,
} from "@/types/task.types";

import { CreateTaskInput } from "@/validations/task.schema";


// --------------------------------------------------
// Get Project Tasks
// --------------------------------------------------

export const getMyTasks = async (
  page = 1,
  limit = 9,
  projectId: string
) => {

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    projectId,
  });

  const response = await api.get<GetTasksResponse>(
    `/tasks?${query.toString()}`
  );

  return response.data;
};


// --------------------------------------------------
// Create Task
// --------------------------------------------------

export const createTask = async (
  data: CreateTaskInput
) => {

  const response = await api.post(
    "/tasks",
    data
  );

  return response.data;
};


// --------------------------------------------------
// Update Task Status
// --------------------------------------------------

export const updateTaskStatus = async (
  taskId: string,
  status: TaskStatus
) => {

  const response = await api.patch(
    `/tasks/${taskId}/status`,
    {
      status,
    }
  );

  return response.data;
};


// --------------------------------------------------
// Update Task
// Project ADMIN only
// --------------------------------------------------

export const updateTask = async (
  taskId: string,
  data: CreateTaskInput
) => {

  const response = await api.put(
    `/tasks/${taskId}`,
    data
  );

  return response.data;
};


// --------------------------------------------------
// Delete Task
// Project ADMIN only
// --------------------------------------------------

export const deleteTask = async (
  taskId: string
) => {

  const response = await api.delete(
    `/tasks/${taskId}`
  );

  return response.data;
};