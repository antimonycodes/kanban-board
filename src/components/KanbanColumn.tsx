import React from "react";
import { Plus, PlusCircleIcon } from "lucide-react";
import type { Column, Task } from "../types/task";
import TaskCard from "./TaskCard";

interface KanbanColumnProps {
  column: Column;
  onAddTask: (status: Column["status"]) => void;
  onEditTask: (task: Task) => void;
  onDrop: (e: React.DragEvent, targetStatus: Column["status"]) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  onAddTask,
  onEditTask,
  onDrop,
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
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

  return (
    <div
      className="rounded-lg p-4 min-h-[400px]"
      onDragOver={handleDragOver}
      onDrop={(e) => onDrop(e, column.status)}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          {column.title}
          <span
            className={` ${getStatusColor(
              column.status
            )} px-2 py-1 rounded-full text-xs`}
          >
            {column.tasks.length}
          </span>
        </h2>
        <button
          onClick={() => onAddTask(column.status)}
          className="text-gray-500 hover:text-gray-700 hover:bg-white p-2 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 min-h-[200px]">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEditTask} />
        ))}

        {column.tasks.length === 0 && (
          <div className=" border border-gray-200  rounded-lg  p-8 w-80  flex items-center justify-center ">
            {/* <div className="text-sm">No tasks yet</div> */}
            <div
              onClick={() => onAddTask(column.status)}
              className="text-black text-sm mt-1"
            >
              <div className=" flex items-center flex-col gap-2">
                <PlusCircleIcon />
                Add task
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
