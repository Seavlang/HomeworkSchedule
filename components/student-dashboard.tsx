"use client";

import { format, parseISO, isAfter, startOfToday, isBefore, isSameDay } from "date-fns";
import { Homework, Subject, SUBJECT_COLORS } from "@/types";

interface StudentDashboardProps {
  homeworks: Homework[];
}

export function StudentDashboard({ homeworks }: StudentDashboardProps) {
  const today = startOfToday();
  const upcomingHomeworks = homeworks
    .filter((hw) => {
      const dueDate = parseISO(hw.dueDate);
      return isAfter(dueDate, today) || isSameDay(dueDate, today);
    })
    .sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime());

  // Group by date
  const homeworksByDate: Record<string, Homework[]> = {};
  upcomingHomeworks.forEach((hw) => {
    const dateKey = format(parseISO(hw.dueDate), "yyyy-MM-dd");
    if (!homeworksByDate[dateKey]) {
      homeworksByDate[dateKey] = [];
    }
    homeworksByDate[dateKey].push(hw);
  });

  const sortedDates = Object.keys(homeworksByDate).sort();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border-2 border-indigo-100 shadow-lg p-6 backdrop-blur-sm">
        <h2 className="text-3xl font-bold mb-6 text-indigo-700">
          📚 Upcoming Homework
        </h2>

        {sortedDates.length === 0 ? (
          <p className="text-indigo-600 text-center py-8 font-medium">
            ✨ No upcoming homework assignments.
          </p>
        ) : (
          <div className="space-y-6">
            {sortedDates.map((dateStr) => {
              const date = parseISO(dateStr);
              const dayHomeworks = homeworksByDate[dateStr];
              const isToday = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
              const isTomorrow =
                format(date, "yyyy-MM-dd") ===
                format(new Date(today.getTime() + 86400000), "yyyy-MM-dd");

              return (
                <div
                  key={dateStr}
                  className={`border-2 rounded-xl p-5 shadow-md ${
                    isToday
                      ? "border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-blue-200"
                      : isTomorrow
                      ? "border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-amber-200"
                      : "border-indigo-200 bg-white hover:border-indigo-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {format(date, "EEEE, MMMM d, yyyy")}
                      </h3>
                      {isToday && (
                        <span className="inline-block mt-1 px-3 py-1 text-sm text-blue-700 font-semibold bg-blue-100 rounded-full">
                          ⭐ Today
                        </span>
                      )}
                      {isTomorrow && (
                        <span className="inline-block mt-1 px-3 py-1 text-sm text-amber-700 font-semibold bg-amber-100 rounded-full">
                          🔜 Tomorrow
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      {dayHomeworks.length} assignment{dayHomeworks.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {dayHomeworks.map((hw) => (
                      <div
                        key={hw.id}
                        className={`flex items-start justify-between p-3 rounded-lg border ${SUBJECT_COLORS[hw.subject]}`}
                      >
                        <div className="flex-1">
                          <h4 className="font-medium mb-1" title={hw.title}>{hw.title}</h4>
                          <p className="text-sm opacity-80 mb-2" title={hw.description || "No description"}>
                            {hw.description || "No description"}
                          </p>
                          <div className="flex items-center gap-4 text-xs">
                            <span>Subject: {hw.subject}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

