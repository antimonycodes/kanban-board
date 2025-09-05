import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useCreateTask } from "../hooks/useTasks";
import { toast } from "sonner";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStatus: "pending" | "in progres" | "completed";
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  initialStatus,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const createTaskMutation = useCreateTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTaskMutation.mutateAsync({
        title: title.trim(),
        content: content.trim(),
        status: initialStatus,
      });

      setTitle("");
      setContent("");
      onClose();
    } catch (error) {
      console.error("Failed to add task:", error);
      toast.error("Failed to add task. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Add New Task</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title..."
              required
              disabled={createTaskMutation.isPending}
              maxLength={200}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task description..."
              disabled={createTaskMutation.isPending}
              maxLength={20000}
            />
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600">
              This task will be added to the{" "}
              <strong>
                {initialStatus === "in progres"
                  ? "In Progress"
                  : initialStatus.charAt(0).toUpperCase() +
                    initialStatus.slice(1)}
              </strong>{" "}
              column
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={createTaskMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createTaskMutation.isPending || !title.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {createTaskMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Add Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
