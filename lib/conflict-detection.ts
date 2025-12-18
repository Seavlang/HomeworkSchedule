import { Homework, ConflictWarning } from "@/types";
import { isSameDay, parseISO } from "date-fns";

export function detectConflicts(
  newHomework: Omit<Homework, "id">,
  existingHomeworks: Homework[]
): ConflictWarning[] {
  const warnings: ConflictWarning[] = [];
  const dueDate = parseISO(newHomework.dueDate);

  // Check for same-day conflicts
  const sameDayHomeworks = existingHomeworks.filter((hw) =>
    isSameDay(parseISO(hw.dueDate), dueDate)
  );

  if (sameDayHomeworks.length > 0) {
    warnings.push({
      type: "sameDay",
      message: `${sameDayHomeworks.length} other homework assignment(s) due on the same day`,
      affectedDates: [newHomework.dueDate],
    });
  }

  return warnings;
}

