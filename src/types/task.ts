export interface Task {
  id: number;
  title: string;
  content: string;
  status: "pending" | "in progres" | "completed";
  created_at: string;
  updated_at: string;
}

export interface Column {
  id: string;
  title: string;
  status: "pending" | "in progres" | "completed";
  tasks: Task[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}
