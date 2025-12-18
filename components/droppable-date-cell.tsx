"use client";

import { useDroppable } from "@dnd-kit/core";
import { format, isSameDay, parseISO } from "date-fns";
import { Homework } from "@/types";
import { cn } from "@/lib/utils";
import { DraggableHomeworkCard } from "./draggable-homework-card";

interface DroppableDateCellProps {
  date: Date;
  dateId: string;
  isSelected: boolean;
  isToday: boolean;
  homeworks: Homework[];
  isDraggable: boolean;
  onDateClick?: (date: Date) => void;
  activeId: string | null;
  onEditHomework?: (homework: Homework) => void;
  onDeleteHomework?: (id: string) => void;
  showActions?: boolean;
}

export function DroppableDateCell({
  date,
  dateId,
  isSelected,
  isToday,
  homeworks,
  isDraggable,
  onDateClick,
  activeId,
  onEditHomework,
  onDeleteHomework,
  showActions = true,
}: DroppableDateCellProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: dateId,
    disabled: !isDraggable,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-24 border-2 rounded-xl p-2 transition-all shadow-sm",
        isSelected && "ring-2 ring-indigo-500 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-300 shadow-md",
        isToday && !isSelected && "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 shadow-md",
        !isSelected && !isToday && "border-indigo-100 bg-white hover:border-indigo-200",
        isOver && "ring-2 ring-emerald-400 bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-300 shadow-lg scale-105",
        isDraggable && "cursor-pointer hover:border-indigo-300 hover:shadow-md"
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
          <DraggableHomeworkCard
            key={hw.id}
            homework={hw}
            isOverlay={activeId === hw.id}
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
        {isOver && homeworks.length === 0 && (
          <div className="text-xs text-emerald-700 font-semibold py-2 text-center border-2 border-dashed border-emerald-400 rounded-lg bg-emerald-50 animate-pulse">
            ✨ Drop here
          </div>
        )}
      </div>
    </div>
  );
}

