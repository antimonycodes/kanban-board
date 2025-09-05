import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../api/taskApi";
import { toast } from "sonner";
import type { Task } from "../types/task";

export const useTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: taskApi.fetchTasks,
    staleTime: 1000 * 60 * 1,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: () => {
      toast.success("Task created successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: any) => {
      toast.error(error.message || " Failed to create task");
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) =>
      taskApi.updateTask(id, updates),
    onSuccess: () => {
      toast.success("Task updated successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: any) => {
      toast.error(error.message || " Failed to update task");
    },
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      taskApi.updateTaskStatus(id, status),

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(
          ["tasks"],
          (old) =>
            old?.map((task) =>
              task.id === id ? { ...task, status: status as any } : task
            ) || []
        );
      }

      return { previousTasks };
    },

    onSuccess: () => {
      toast.success(" Task status updated");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },

    onError: (error: any, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
      toast.error(error.message || "Failed to update task status");
      console.log(variables);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskApi.deleteTask,
    onSuccess: () => {
      toast.success(" Task deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete task");
    },
  });
};
