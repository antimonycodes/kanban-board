import React, { useState, useEffect } from "react";
import {  Loader2 } from "lucide-react";
import type { Task } from "../types/task";
import { useUpdateTask } from "../hooks/useTasks";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  task,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const updateTaskMutation = useUpdateTask();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setContent(task.content);
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !task) return;

    try {
      await updateTaskMutation.mutateAsync({
        id: task.id,
        updates: {
          title: title.trim(),
          content: content.trim(),
        },
      });

      onClose();
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Failed to update task. Please try again.");
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Edit Task</h2>

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
              disabled={updateTaskMutation.isPending}
              maxLength={200}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task description..."
              disabled={updateTaskMutation.isPending}
              maxLength={20000}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={updateTaskMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateTaskMutation.isPending || !title.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {updateTaskMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Update Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
