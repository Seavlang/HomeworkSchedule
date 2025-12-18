"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Homework, Subject, SUBJECTS, ConflictWarning } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, BookOpen, FileText, Calendar, CalendarCheck } from "lucide-react";
import { checkConflicts } from "@/lib/api";

interface HomeworkFormProps {
  homework?: Homework;
  existingHomeworks: Homework[];
  onSubmit: (homework: Omit<Homework, "id">) => void;
  onCancel: () => void;
}

export function HomeworkForm({
  homework,
  existingHomeworks,
  onSubmit,
  onCancel,
}: HomeworkFormProps) {
  const [formData, setFormData] = useState({
    subject: (homework?.subject || "") as Subject | "",
    title: homework?.title || "",
    description: "", // Keep for API compatibility but don't show in form
    assignedDate: homework
      ? format(new Date(homework.assignedDate), "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd"),
    dueDate: homework
      ? format(new Date(homework.dueDate), "yyyy-MM-dd")
      : "",
    createdBy: homework?.createdBy || "Teacher",
  });

  const [conflicts, setConflicts] = useState<ConflictWarning[]>([]);

  useEffect(() => {
    if (formData.dueDate && formData.assignedDate && formData.subject) {
      const checkForConflicts = async () => {
        try {
          const newHomework: Omit<Homework, "id"> = {
            subject: formData.subject as Subject,
            title: formData.title,
            description: formData.description,
            assignedDate: new Date(formData.assignedDate).toISOString(),
            dueDate: new Date(formData.dueDate).toISOString(),
            createdBy: formData.createdBy,
          };

          const warnings = await checkConflicts(
            newHomework,
            homework?.id
          );
          setConflicts(warnings);
        } catch (error) {
          console.error("Failed to check conflicts:", error);
          // Fallback to local conflict detection
          const dueDate = new Date(formData.dueDate);
          const sameDayHomeworks = existingHomeworks.filter(
            (hw) =>
              (!homework || hw.id !== homework.id) &&
              new Date(hw.dueDate).toDateString() === dueDate.toDateString()
          );

          const warnings: ConflictWarning[] = [];
          if (sameDayHomeworks.length > 0) {
            warnings.push({
              type: "sameDay",
              message: `${sameDayHomeworks.length} other homework assignment(s) due on the same day`,
              affectedDates: [formData.dueDate],
            });
          }
          setConflicts(warnings);
        }
      };

      checkForConflicts();
    } else {
      setConflicts([]);
    }
  }, [formData, existingHomeworks, homework]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.title || !formData.assignedDate || !formData.dueDate) {
      return;
    }

    onSubmit({
      subject: formData.subject as Subject,
      title: formData.title,
      description: formData.description,
      assignedDate: new Date(formData.assignedDate).toISOString(),
      dueDate: new Date(formData.dueDate).toISOString(),
      createdBy: formData.createdBy,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
        <Label htmlFor="subject" className="text-indigo-700 text-base font-semibold flex items-center gap-2 mb-2">
          <BookOpen className="h-5 w-5" />
          Subject *
        </Label>
        <Select
          value={formData.subject}
          onValueChange={(value) =>
            setFormData({ ...formData, subject: value as Subject })
          }
        >
          <SelectTrigger id="subject">
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            {SUBJECTS.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
        <Label htmlFor="title" className="text-blue-700 text-base font-semibold flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5" />
          Homework Title *
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="assignedDate" className="text-emerald-700 text-base font-semibold flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5" />
              Assigned Date *
            </Label>
          <Input
            id="assignedDate"
            type="date"
            value={formData.assignedDate}
            onChange={(e) =>
              setFormData({ ...formData, assignedDate: e.target.value })
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="dueDate" className="text-emerald-700 text-base font-semibold flex items-center gap-2 mb-2">
            <CalendarCheck className="h-5 w-5" />
            Due Date *
          </Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            required
            min={formData.assignedDate}
          />
        </div>
        </div>
      </div>

      {conflicts.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 space-y-2 shadow-md">
          <div className="flex items-center gap-2 text-amber-800 font-bold">
            <AlertCircle className="h-5 w-5" />
            ⚠️ Conflict Warnings
          </div>
          {conflicts.map((conflict, index) => (
            <div key={index} className="text-sm font-semibold text-amber-700 bg-white/50 rounded-lg p-2">
              {conflict.message}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-6 border-t-2 border-indigo-100">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="shadow-md">Save Homework</Button>
      </div>
    </form>
  );
}

