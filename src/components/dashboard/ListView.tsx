"use client";

import { useFilteredTasks } from "@/hooks/useFilteredTasks";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppSelector";
import { setSortField } from "@/store/slices/uiSlice";
import { SortField } from "@/types";
import TaskCard from "@/components/tasks/TaskCard";
import EmptyState from "@/components/common/EmptyState";

const columns: { field: SortField; label: string }[] = [
  { field: "title", label: "Task" },
  { field: "priority", label: "Priority" },
  { field: "dueDate", label: "Due Date" },
  { field: "createdAt", label: "Created" },
];

interface ListViewProps {
  onAddTask: () => void;
}

export default function ListView({ onAddTask }: ListViewProps) {
  const tasks = useFilteredTasks();
  const dispatch = useAppDispatch();
  const { sortField, sortDirection } = useAppSelector((s) => s.ui);

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
          </svg>
        }
        title="No tasks yet"
        description="Create your first task to get started with organizing your work."
        action={{ label: "Add Task", onClick: onAddTask }}
      />
    );
  }

  return (
    <div>
      {/* Sort bar */}
      <div className="mb-4 hidden items-center gap-4 rounded-lg bg-surface-secondary px-4 py-2 text-xs font-medium text-text-tertiary sm:flex">
        {columns.map((col) => (
          <button
            key={col.field}
            onClick={() => dispatch(setSortField(col.field))}
            className={`flex items-center gap-1 transition-colors hover:text-text-primary ${
              sortField === col.field ? "text-primary-600" : ""
            } ${col.field === "title" ? "flex-1" : ""}`}
          >
            {col.label}
            {sortField === col.field && (
              <svg className={`h-3 w-3 transition-transform ${sortDirection === "asc" ? "rotate-180" : ""}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
