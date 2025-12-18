"use client";

import { format, isSameDay } from "date-fns";
import { Homework } from "@/types";
import { cn } from "@/lib/utils";
import { HomeworkCard } from "./homework-card";

interface DateCellProps {
  date: Date;
  isSelected: boolean;
  isToday: boolean;
  homeworks: Homework[];
  onDateClick?: (date: Date) => void;
  onEditHomework?: (homework: Homework) => void;
  onDeleteHomework?: (id: string) => void;
  showActions?: boolean;
}

export function DateCell({
  date,
  isSelected,
  isToday,
  homeworks,
  onDateClick,
  onEditHomework,
  onDeleteHomework,
  showActions = true,
}: DateCellProps) {
  return (
    <div
      className={cn(
        "min-h-24 border-2 rounded-xl p-2 transition-all shadow-sm cursor-pointer",
        isSelected && "ring-2 ring-indigo-500 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-300 shadow-md",
        isToday && !isSelected && "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 shadow-md",
        !isSelected && !isToday && "border-indigo-100 bg-white hover:border-indigo-200 hover:shadow-md"
      )}
      onClick={() => onDateClick?.(date)}
    >
      <div
        className={cn(
          "text-sm font-bold mb-1 text-gray-800",
          isToday && "text-blue-700 font-extrabold text-base"
        )}
      >
        {format(date, "d")}
      </div>
      <div className="space-y-1 min-h-[60px]">
        {homeworks.slice(0, 3).map((hw) => (
          <HomeworkCard
            key={hw.id}
            homework={hw}
            onEdit={onEditHomework}
            onDelete={onDeleteHomework}
            showActions={showActions}
          />
        ))}
        {homeworks.length > 3 && (
          <div className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-1 rounded">
            +{homeworks.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
}
