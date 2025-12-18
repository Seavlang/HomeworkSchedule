"use client";

import { Homework, SUBJECT_COLORS } from "@/types";
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";

interface HomeworkCardProps {
  homework: Homework;
  onEdit?: (homework: Homework) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export function HomeworkCard({
  homework,
  onEdit,
  onDelete,
  showActions = true,
}: HomeworkCardProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(homework);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(homework.id);
  };

  const shouldShowActions = showActions && (onEdit || onDelete);

  return (
    <div
      className={cn(
        "text-xs px-2 py-1 rounded border truncate transition-all relative group",
        SUBJECT_COLORS[homework.subject]
      )}
      title={homework.title}
    >
      <div className="flex items-center gap-1">
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
