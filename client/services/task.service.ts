import api from "@/lib/axios";
import {GetTasksResponse,} from "@/types/task.types";
import { CreateTaskInput } from "@/validations/task.schema";


//Get All Task
export const getMyTasks = async () => {
  const response =
    await api.get<GetTasksResponse>("/tasks");

  return response.data;
};


//Create New Task
export const createTask = async (
  data: CreateTaskInput
) => {

  const response = await api.post("/tasks",data);

  return response.data;
};

// Update Task
export  const updateTask = async (
  taskId: string,
  data: CreateTaskInput
) => {
  const response = await api.put(
    `/tasks/${taskId}`,
    data
  );
  return response.data;
}