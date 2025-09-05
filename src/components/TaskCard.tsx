import React, { useState } from "react";
import { GripVertical, Trash2, Pencil, Loader2 } from "lucide-react";
import type { Task } from "../types/task";
import { useDeleteTask } from "../hooks/useTasks";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const deleteTaskMutation = useDeleteTask();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTaskMutation.mutateAsync(task.id);
      setShowConfirm(false);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-[#CCFFE7] text-[#009952] border border-primary";
      case "in progres":
        return "bg-[#FEF3CD] text-[#B58A00]";
      case "pending":
        return "bg-[#FBE1E1] text-[#F83E41] border border-red-200";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Task Card */}
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", task.id.toString());
        }}
        className="bg-white rounded-xl p-4 shadow-md border border-gray-200 cursor-move hover:shadow-lg transition-all flex flex-col gap-3"
      >
        {/* Top Row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="text-gray-400 w-4 h-4" />
            <h3 className="font-semibold text-gray-800">{task.title}</h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Edit Button */}
            <button
              onClick={() => onEdit(task)}
              className="text-gray-400 transition-colors"
            >
              <Pencil size={18} />
            </button>

            {/* Delete Button */}
            <button
              onClick={() => setShowConfirm(true)}
              className="text-red-500 hover:text-red-700 transition-colors"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <Trash2 size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        {task.content && (
          <p className="text-sm text-gray-600">{task.content}</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{formatDate(task.created_at)}</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              task.status
            )}`}
          >
            {task.status === "in progres"
              ? "In Progress"
              : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Confirm Delete
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <b className=" text-red-600">{task.title}</b>? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className=" animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;
