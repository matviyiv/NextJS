"use client";

import { useAppSelector } from "@/hooks/useAppSelector";

export default function StatsPanel() {
  const tasks = useAppSelector((s) => s.tasks.items);

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const todoTasks = tasks.filter((t) => t.status === "todo").length;
  const highPriority = tasks.filter((t) => t.priority === "high" && t.status !== "done").length;
  const overdue = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done"
  ).length;
  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const stats = [
    { label: "Total", value: totalTasks, color: "text-primary-600", bg: "bg-primary-50" },
    { label: "To Do", value: todoTasks, color: "text-slate-600", bg: "bg-slate-50" },
    { label: "In Progress", value: inProgressTasks, color: "text-warning-600", bg: "bg-warning-50" },
    { label: "Done", value: doneTasks, color: "text-success-600", bg: "bg-success-50" },
    { label: "High Priority", value: highPriority, color: "text-danger-600", bg: "bg-danger-50" },
    { label: "Overdue", value: overdue, color: "text-danger-600", bg: "bg-danger-50" },
  ];

  return (
    <div className="mb-6">
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl ${stat.bg} p-4 transition-all hover:shadow-sm`}
          >
            <p className="text-xs font-medium text-text-secondary">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Completion bar */}
      {totalTasks > 0 && (
        <div className="rounded-xl bg-surface-secondary p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-text-primary">Overall Progress</span>
            <span className="font-semibold text-primary-600">{completionRate}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-surface-tertiary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
