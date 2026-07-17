export type TaskStatus = 
    | "TODO" 
    | "IN PROGRESS"
    | "DONE";
    
export type TaskPriority = 
    | "LOW"
    | "MEDIUM"
    | "HIGH";

export interface Task{
    id: string;

    title: string;
    description?: string | null;

    status: TaskStatus;
    priority: TaskPriority;

    dueDate?: string | null;

    creatorId: string;

  createdAt: string;
  updatedAt: string;

}

export interface GetTasksResponse {
  message: string;
  tasks: Task[];
}