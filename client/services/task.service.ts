import api from "@/lib/axios";
import {GetTasksResponse,} from "@/types/task.types";
import { CreateTaskInput } from "@/validations/task.schema";

import {
  Task,
  TaskStatus,
} from "@/types/task.types";


//Get All Task
export const getMyTasks = async (

  page = 1,

  limit = 9,

  projectId?: string,
) => {

  const query = new URLSearchParams({

  page: String(page),

  limit: String(limit),

});

if (projectId) {

  query.append("projectId", projectId);

}

const response =
  await api.get<GetTasksResponse>(

    `/tasks?${query.toString()}`

  );

  return response.data;
};;


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

//Delete Task

export const deleteTask = async(
  taskId: string
) => {
  const response = await api.delete(`/tasks/${taskId}`);

  return response.data
}

//Drag and Drop 
export const updateTaskStatus = async (
  task: Task,
  status: TaskStatus
) => {

  const response = await api.put(

    `/tasks/${task.id}`,

    {

      title: task.title,

      description: task.description,

      priority: task.priority,

      dueDate: task.dueDate,

      projectId: task.projectId,

      status,

    }

  );

  return response.data;

};