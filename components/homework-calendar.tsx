"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  addMonths,
  subMonths,
  startOfDay,
  isAfter,
  isBefore,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Homework, Subject } from "@/types";
import { Button } from "@/components/ui/button";
import { HomeworkCard } from "./homework-card";
import { DateCell } from "./date-cell";

interface HomeworkCalendarProps {
  homeworks: Homework[];
  selectedSubjects: Set<Subject>;
  onDateClick?: (date: Date) => void;
  selectedDate?: Date;
  viewMode?: "month" | "week";
  onEditHomework?: (homework: Homework) => void;
  onDeleteHomework?: (id: string) => void;
  showActions?: boolean;
}

export function HomeworkCalendar({
  homeworks,
  selectedSubjects,
  onDateClick,
  selectedDate,
  viewMode = "month",
  onEditHomework,
  onDeleteHomework,
  showActions = true,
}: HomeworkCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get first day of month to calculate offset
  const firstDayOfWeek = monthStart.getDay();
  const daysBeforeMonth = Array.from(
    { length: firstDayOfWeek },
    (_, i) => null
  );

  const filteredHomeworks = homeworks.filter((hw) =>
    selectedSubjects.has(hw.subject)
  );

  const getHomeworksForDate = (date: Date) => {
    const normalizedDate = startOfDay(date);
    return filteredHomeworks.filter((hw) => {
      const assignedDate = startOfDay(parseISO(hw.assignedDate));
      const dueDate = startOfDay(parseISO(hw.dueDate));
      // Show homework on all days from assigned date to due date (inclusive)
      // Check if date is on or after assigned date AND on or before due date
      return (isAfter(normalizedDate, assignedDate) || isSameDay(normalizedDate, assignedDate)) &&
             (isBefore(normalizedDate, dueDate) || isSameDay(normalizedDate, dueDate));
    });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) =>
      direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  };

  return (
    <div className="bg-white rounded-xl border-2 border-indigo-100 shadow-lg p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-indigo-700">
            {format(currentDate, "MMMM yyyy")}
          </h2>
        </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-bold text-gray-800 py-2"
            >
              {day}
            </div>
          ))}

          {daysBeforeMonth.map((_, index) => (
            <div key={`empty-${index}`} className="h-24" />
          ))}

          {days.map((day) => {
            const dayHomeworks = getHomeworksForDate(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());

            return (
              <DateCell
                key={day.toISOString()}
                date={day}
                isSelected={isSelected}
                isToday={isToday}
                homeworks={dayHomeworks}
                onDateClick={onDateClick}
                onEditHomework={onEditHomework}
                onDeleteHomework={onDeleteHomework}
                showActions={showActions}
              />
            );
          })}
        </div>
      </div>
  );
}
