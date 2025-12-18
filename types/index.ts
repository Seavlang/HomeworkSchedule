export type Subject = 
  | "Web"
  | "Java"
  | "Spring"
  | "Database"
  | "Git"
  | "UX/UI"
  | "Deployment";

export type UserRole = "teacher" | "student";

export interface Homework {
  id: string;
  subject: Subject;
  title: string;
  description: string;
  assignedDate: string; // ISO date string
  dueDate: string; // ISO date string
  createdBy: string; // teacher name/ID
}

export interface ConflictWarning {
  type: "sameDay";
  message: string;
  affectedDates?: string[];
}

export const SUBJECT_COLORS: Record<Subject, string> = {
  Web: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-2 border-blue-400 shadow-sm",
  Java: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-400 shadow-sm",
  Spring: "bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 border-2 border-teal-400 shadow-sm",
  Database: "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-2 border-purple-400 shadow-sm",
  Git: "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-2 border-orange-400 shadow-sm",
  "UX/UI": "bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 border-2 border-pink-400 shadow-sm",
  Deployment: "bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 border-2 border-indigo-400 shadow-sm",
};

export const SUBJECTS: Subject[] = [
  "Web",
  "Java",
  "Spring",
  "Database",
  "Git",
  "UX/UI",
  "Deployment",
];

