"use client";

import { Subject, SUBJECTS, SUBJECT_COLORS } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Map subjects to their circle indicator colors (matching border colors)
const SUBJECT_CIRCLE_COLORS: Record<Subject, string> = {
  Web: "bg-blue-400",
  Java: "bg-green-400",
  Spring: "bg-teal-400",
  Database: "bg-purple-400",
  Git: "bg-orange-400",
  "UX/UI": "bg-pink-400",
  Deployment: "bg-indigo-400",
};

interface SubjectFilterProps {
  selectedSubjects: Set<Subject>;
  onToggleSubject: (subject: Subject) => void;
}

export function SubjectFilter({
  selectedSubjects,
  onToggleSubject,
}: SubjectFilterProps) {
  return (
    <div className="bg-white rounded-xl border-2 border-indigo-100 shadow-lg p-3 backdrop-blur-sm">
      <h3 className="text-lg font-bold mb-3 text-indigo-700">
        📚 Filter by Subject
      </h3>
      <div className="space-y-1">
        {SUBJECTS.map((subject) => {
          const isSelected = selectedSubjects.has(subject);
          // Extract background and border from SUBJECT_COLORS, but keep text readable
          const subjectColorClasses = SUBJECT_COLORS[subject].split(" ");
          const bgGradient = subjectColorClasses.find(cls => cls.startsWith("bg-gradient")) || "";
          const borderClass = subjectColorClasses.find(cls => cls.startsWith("border-")) || "";
          
          // Get the circle color for this subject
          const circleColor = SUBJECT_CIRCLE_COLORS[subject];
          
          return (
            <div
              key={subject}
              className={`flex items-center space-x-1.5 cursor-pointer p-1.5 rounded-md transition-all ${
                isSelected
                  ? `${bgGradient} ${borderClass} shadow-sm`
                  : "bg-gray-50 hover:bg-gray-100 border-2 border-gray-200"
              }`}
              onClick={() => onToggleSubject(subject)}
            >
              <Checkbox
                id={subject}
                checked={isSelected}
                onCheckedChange={() => onToggleSubject(subject)}
              />
              <Label
                htmlFor={subject}
                className={`cursor-pointer flex items-center gap-1.5 flex-1 text-sm font-semibold ${
                  isSelected 
                    ? subjectColorClasses.find(cls => cls.startsWith("text-")) || "text-gray-800"
                    : "text-gray-800"
                }`}
              >
                <span
                  className={`inline-block w-3 h-3 rounded-full shadow-sm ${circleColor}`}
                />
                {subject}
              </Label>
            </div>
          );
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-indigo-200">
        <button
          onClick={() => {
            SUBJECTS.forEach((subject) => {
              if (!selectedSubjects.has(subject)) {
                onToggleSubject(subject);
              }
            });
          }}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          Select All
        </button>
        {" / "}
        <button
          onClick={() => {
            selectedSubjects.forEach((subject) => {
              onToggleSubject(subject);
            });
          }}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          Deselect All
        </button>
      </div>
    </div>
  );
}

