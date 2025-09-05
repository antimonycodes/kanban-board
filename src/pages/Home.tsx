import React, { useState, useMemo } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { useTasks, useUpdateTaskStatus } from "../hooks/useTasks";
import type { Column, Task } from "../types/task";
import { calculateTaskStats, groupTasksByStatus } from "../utils/index";
import StatsCards from "../components/StatsCards";
import KanbanColumn from "../components/KanbanColumn";
import AddTaskModal from "../components/AddTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import { toast } from "sonner";

const Home: React.FC = () => {
  const { data: tasks = [], isLoading, error, refetch } = useTasks();
  const updateTaskStatusMutation = useUpdateTaskStatus();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<
    "pending" | "in progres" | "completed"
  >("pending");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const taskStats = useMemo(() => calculateTaskStats(tasks), [tasks]);
  const groupedTasks = useMemo(() => groupTasksByStatus(tasks), [tasks]);

  const columns: Column[] = [
    {
      id: "pending",
      title: "To do",
      status: "pending",
      tasks: groupedTasks.pending,
    },
    {
      id: "in_progress",
      title: "Doing",
      status: "in progres",
      tasks: groupedTasks.inProgress,
    },
    {
      id: "completed",
      title: "Done",
      status: "completed",
      tasks: groupedTasks.completed,
    },
  ];

  const handleDrop = async (
    e: React.DragEvent,
    targetStatus: "pending" | "in progres" | "completed"
  ) => {
    e.preventDefault();

    const taskId = parseInt(e.dataTransfer.getData("text/plain"));
    if (!taskId) return;

    const taskToMove = tasks.find((task) => task.id === taskId);
    if (!taskToMove || taskToMove.status === targetStatus) return;

    try {
      await updateTaskStatusMutation.mutateAsync({
        id: taskId,
        status: targetStatus,
      });
    } catch (error) {
      toast.error("Failed to move task. Please try again.");
    }
  };

  const openModal = (status: "pending" | "in progres" | "completed") => {
    setModalStatus(status);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">
            Failed to load tasks. Please try again.
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className=" flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
          </div>
        </div>

        <StatsCards stats={taskStats} isLoading={isLoading} />

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center gap-3 text-gray-600">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                onAddTask={openModal}
                onEditTask={handleEditTask}
                onDrop={handleDrop}
              />
            ))}
          </div>
        )}

        <AddTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialStatus={modalStatus}
        />

        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTask(null);
          }}
          task={editingTask}
        />
      </div>
    </div>
  );
};

export default Home;
