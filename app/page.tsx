"use client";

import { useState, useEffect, useRef } from "react";
import { UserRole, Homework, Subject, SUBJECTS, SUBJECT_COLORS } from "@/types";
import { HomeworkCalendar } from "@/components/homework-calendar";
import { HomeworkForm } from "@/components/homework-form";
import { SubjectFilter } from "@/components/subject-filter";
import { StudentDashboard } from "@/components/student-dashboard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Plus, BookOpen, Calendar, ChevronRight, ChevronLeft, X, CalendarDays, Clock, Edit2, Trash2, FileText } from "lucide-react";
import { fetchHomeworks, createHomework, updateHomework, deleteHomework } from "@/lib/api";
import { toast } from "sonner";

export default function Home() {
  const [userRole, setUserRole] = useState<UserRole>("teacher");
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<Set<Subject>>(
    new Set(SUBJECTS)
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHomework, setEditingHomework] = useState<Homework | undefined>();
  const [loading, setLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [homeworkToDelete, setHomeworkToDelete] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadHomeworks();
  }, []);

  // Handle click outside sidebar to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('button[aria-label="Toggle homework sidebar"]')
      ) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const loadHomeworks = async () => {
    try {
      setLoading(true);
      const data = await fetchHomeworks();
      setHomeworks(data);
    } catch (error) {
      console.error("Failed to load homeworks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHomework = async (homework: Omit<Homework, "id">) => {
    try {
      if (editingHomework) {
        const updated = await updateHomework(editingHomework.id, homework);
        setHomeworks((prev) =>
          prev.map((hw) => (hw.id === editingHomework.id ? updated : hw))
        );
        toast.success("Homework updated successfully!");
      } else {
        const newHomework = await createHomework(homework);
        setHomeworks((prev) => [...prev, newHomework]);
        toast.success("Homework created successfully!");
      }
      setIsFormOpen(false);
      setEditingHomework(undefined);
      await loadHomeworks(); // Reload to get fresh data
    } catch (error) {
      console.error("Failed to save homework:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save homework. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (id: string) => {
    setHomeworkToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!homeworkToDelete) return;
    
    try {
      await deleteHomework(homeworkToDelete);
      toast.success("Homework deleted successfully!");
      await loadHomeworks(); // Reload to get fresh data
    } catch (error) {
      console.error("Failed to delete homework:", error);
      toast.error("Failed to delete homework. Please try again.");
    } finally {
      setHomeworkToDelete(null);
    }
  };

  const toggleSubject = (subject: Subject) => {
    setSelectedSubjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subject)) {
        newSet.delete(subject);
      } else {
        newSet.add(subject);
      }
      return newSet;
    });
  };

  const openForm = (homework?: Homework) => {
    setEditingHomework(homework);
    setIsFormOpen(true);
  };


  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border-b border-indigo-300/20 sticky top-0 z-10 shadow-lg">
        <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white drop-shadow-md">
                Homework Schedule Manager
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg p-1 border border-white/30">
                <button
                  onClick={() => setUserRole("teacher")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    userRole === "teacher"
                      ? "bg-white text-indigo-600 shadow-md"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  Teacher
                </button>
                <button
                  onClick={() => setUserRole("student")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    userRole === "student"
                      ? "bg-white text-indigo-600 shadow-md"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  Student
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userRole === "teacher" ? (
          <div className="flex gap-6 relative">
            <div className="w-64 flex-shrink-0">
              <SubjectFilter
                selectedSubjects={selectedSubjects}
                onToggleSubject={toggleSubject}
              />
              <div className="mt-4">
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setEditingHomework(undefined);
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      New Homework
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="pb-4 border-b border-gray-200">
                      <DialogTitle className="flex items-center gap-3 text-2xl text-gray-900">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <FileText className="h-6 w-6 text-indigo-600" />
                        </div>
                        {editingHomework ? "Edit Homework" : "Create New Homework"}
                      </DialogTitle>
                    </DialogHeader>
                    <HomeworkForm
                      homework={editingHomework}
                      existingHomeworks={homeworks}
                      onSubmit={handleCreateHomework}
                      onCancel={() => {
                        setIsFormOpen(false);
                        setEditingHomework(undefined);
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="flex-1">
              <HomeworkCalendar
                homeworks={homeworks}
                selectedSubjects={selectedSubjects}
                selectedDate={selectedDate}
                onDateClick={(date) => {
                  setSelectedDate(date);
                  setIsSidebarOpen(true);
                }}
                onEditHomework={(homework) => openForm(homework)}
                onDeleteHomework={handleDeleteClick}
                showActions={true}
              />
            </div>

            {/* Toggle Button */}
            {selectedDate && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed right-4 top-1/2 -translate-y-1/2 z-30 bg-indigo-600 text-white p-2 rounded-l-lg shadow-lg hover:bg-indigo-700 transition-colors"
                aria-label="Toggle homework sidebar"
              >
                {isSidebarOpen ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronLeft className="h-5 w-5" />
                )}
              </button>
            )}

            {/* Overlay */}
            {isSidebarOpen && selectedDate && (
              <div
                className="fixed inset-0 bg-black/20 z-10"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            {/* Right Sidebar */}
            {selectedDate && (
              <div
                ref={sidebarRef}
                className={`fixed right-0 top-0 h-full w-96 bg-white border-l-2 border-indigo-100 shadow-2xl z-20 transition-transform duration-300 ease-in-out ${
                  isSidebarOpen ? "translate-x-0" : "translate-x-full"
                }`}
              >
                <div className="h-full flex flex-col">
                  <div className="p-6 border-b-2 border-indigo-100 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-indigo-700">
                       Homework  on {selectedDate.toLocaleDateString()}
                    </h3>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="p-1 hover:bg-indigo-100 rounded transition-colors"
                      aria-label="Close sidebar"
                    >
                      <X className="h-5 w-5 text-indigo-600" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                      {homeworks
                        .filter((hw) => {
                          const normalizedSelectedDate = new Date(selectedDate);
                          normalizedSelectedDate.setHours(0, 0, 0, 0);
                          const assignedDate = new Date(hw.assignedDate);
                          assignedDate.setHours(0, 0, 0, 0);
                          const dueDate = new Date(hw.dueDate);
                          dueDate.setHours(0, 0, 0, 0);
                          return normalizedSelectedDate >= assignedDate && normalizedSelectedDate <= dueDate;
                        })
                        .map((hw) => {
                          const subjectColorClasses = SUBJECT_COLORS[hw.subject].split(" ");
                          const borderColor = subjectColorClasses.find(cls => cls.startsWith("border-")) || "border-gray-300";
                          const textColor = subjectColorClasses.find(cls => cls.startsWith("text-")) || "text-gray-800";
                          
                          return (
                            <div
                              key={hw.id}
                              className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                            >
                              {/* Subject Badge Header */}
                              <div className={`${SUBJECT_COLORS[hw.subject]} px-4 py-2.5`}>
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm font-bold ${textColor} uppercase tracking-wide`}>
                                    {hw.subject}
                                  </span>
                                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => openForm(hw)}
                                      className="p-1.5 hover:bg-white/30 rounded-lg transition-colors"
                                      title="Edit"
                                    >
                                      <Edit2 className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteClick(hw.id)}
                                      className="p-1.5 hover:bg-red-200/50 rounded-lg transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Card Content */}
                              <div className="p-5">
                                <h4 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2" title={hw.title}>
                                  {hw.title}
                                </h4>
                                
                                {hw.description && (
                                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {hw.description}
                                  </p>
                                )}
                                
                                {/* Date Info */}
                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                                  <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                                    <div className="flex items-center gap-2 mb-1">
                                      <CalendarDays className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                                      <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Assigned</span>
                                    </div>
                                    <p className="text-base font-bold text-indigo-900">
                                      {new Date(hw.assignedDate).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric', 
                                        year: 'numeric' 
                                      })}
                                    </p>
                                  </div>
                                  <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Clock className="h-4 w-4 text-red-600 flex-shrink-0" />
                                      <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">Due</span>
                                    </div>
                                    <p className="text-base font-bold text-red-900">
                                      {new Date(hw.dueDate).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric', 
                                        year: 'numeric' 
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      {homeworks.filter((hw) => {
                        const normalizedSelectedDate = new Date(selectedDate);
                        normalizedSelectedDate.setHours(0, 0, 0, 0);
                        const assignedDate = new Date(hw.assignedDate);
                        assignedDate.setHours(0, 0, 0, 0);
                        const dueDate = new Date(hw.dueDate);
                        dueDate.setHours(0, 0, 0, 0);
                        return normalizedSelectedDate >= assignedDate && normalizedSelectedDate <= dueDate;
                      }).length === 0 && (
                        <p className="text-center text-indigo-600 py-8 font-medium">
                          No homework active on this date
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <StudentDashboard homeworks={homeworks} />
        )}
      </main>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Homework"
        description="Are you sure you want to delete this homework? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
      />
    </div>
  );
}
