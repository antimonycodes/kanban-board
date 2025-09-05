import React from "react";
import type { TaskStats } from "../types/task";

interface StatsCardsProps {
  stats: TaskStats;
  isLoading?: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading }) => {
  const cards = [
    {
      title: "Total Tasks",
      value: stats.total,
    },
    {
      title: "Pending",
      value: stats.pending,
    },
    {
      title: "In Progress",
      value: stats.inProgress,
    },
    {
      title: "Completed",
      value: stats.completed,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => {
        return (
          <div
            key={card.title}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-300 text-center"
          >
            <div className="flex items-center justify-center ">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {isLoading ? (
                    <span className="animate-pulse">-</span>
                  ) : (
                    card.value
                  )}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
