"use client";

import { useDraggable } from "@dnd-kit/core";
import { Homework, SUBJECT_COLORS } from "@/types";
import { cn } from "@/lib/utils";
import { GripVertical, Pencil, Trash2 } from "lucide-react";

interface DraggableHomeworkCardProps {
  homework: Homework;
  isOverlay?: boolean;
  onEdit?: (homework: Homework) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export function DraggableHomeworkCard({
  homework,
  isOverlay = false,
  onEdit,
  onDelete,
  showActions = true,
}: DraggableHomeworkCardProps) {
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: homework.id,
    data: {
      type: "homework",
      homework,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(homework);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(homework.id);
  };

  // Don't show actions in overlay (while dragging)
  const shouldShowActions = showActions && !isOverlay && !isDragging && (onEdit || onDelete);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "text-xs px-2 py-1 rounded border truncate cursor-grab active:cursor-grabbing transition-all relative group",
        SUBJECT_COLORS[homework.subject],
        isDragging && "opacity-50 scale-95",
        isOverlay && "opacity-80 shadow-lg"
      )}
      title={homework.title}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-center gap-1">
        <GripVertical className="h-3 w-3 opacity-70 flex-shrink-0" />
        <span className="flex-1 truncate font-semibold" title={homework.title}>
          {homework.title}
        </span>
        {shouldShowActions && (
          <div className="flex-shrink-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={handleEdit}
                className="p-0.5 hover:bg-white/30 rounded transition-colors"
                title="Edit"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <Pencil className="h-2.5 w-2.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="p-0.5 hover:bg-red-200/50 rounded transition-colors"
                title="Delete"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-2.5 w-2.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

