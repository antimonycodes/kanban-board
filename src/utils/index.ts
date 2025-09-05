import type { Task, TaskStats } from "../types/task";

export const calculateTaskStats = (tasks: Task[]): TaskStats => {
  return {
    total: tasks.length,
    pending: tasks.filter((task) => task.status === "pending").length,
    inProgress: tasks.filter((task) => task.status === "in progres").length,
    completed: tasks.filter((task) => task.status === "completed").length,
  };
};

export const groupTasksByStatus = (tasks: Task[]) => {
  return {
    pending: tasks.filter((task) => task.status === "pending"),
    inProgress: tasks.filter((task) => task.status === "in progres"),
    completed: tasks.filter((task) => task.status === "completed"),
  };
};
