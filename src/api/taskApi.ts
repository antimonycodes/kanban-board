import type { ApiResponse, Task } from "../types/task";
import { apiClient } from "./axiosInstance";
// import { Task, ApiResponse } from "../types/task";

export const taskApi = {
  fetchTasks: async () => {
    const response = await apiClient.get<ApiResponse<Task[]>>("/tasks");

    // if (!response.data.success || !response.data.data) {
    //   console.log("failed");
    //   throw new Error(response.data.error || "Failed to fetch tasks");
    // }

    console.log(response.data.data);
    return response.data.data;
  },

  createTask: async (taskData: {
    title: string;
    content: string;
    status?: string;
  }): Promise<Task> => {
    const response = await apiClient.post<ApiResponse<any>>(
      "tasks/create-task",
      {
        title: taskData.title,
        content: taskData.content,
        status: taskData.status || "pending",
      }
    );

    // if (!response.data.statusCode || !response.data.data) {
    //   throw new Error(response.data.error || "Failed to create task");
    // }

    return response.data.data;
  },

  updateTask: async (
    id: number,
    updates: { title?: string; content?: string; status?: string }
  ): Promise<Task> => {
    const response = await apiClient.put<ApiResponse<any>>(
      `/tasks/${id}`,
      updates
    );

    // if (!response.data.success || !response.data.data) {
    //   throw new Error(response.data.error || "Failed to update task");
    // }

    return response.data.data;
  },

  updateTaskStatus: async (id: number, status: string) => {
    const response = await apiClient.patch<ApiResponse<Task>>(
      `/tasks/${id}/status`,
      {
        status,
      }
    );

    // if (!response.data.success || !response.data.data) {
    //   throw new Error(response.data.error || "Failed to update task status");
    // }

    return response.data.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<Task>>(`/tasks/${id}`);

    console.log(response);
    // if (!response.data.success) {
    //   throw new Error(response.data.error || "Failed to delete task");
    // }
  },
};
