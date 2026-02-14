"use client";

import { useAppSelector, useAppDispatch } from "@/hooks/useAppSelector";
import { updateTask } from "@/store/slices/tasksSlice";
import { setEditingTaskId } from "@/store/slices/uiSlice";
import { Task } from "@/types";
import Badge from "@/components/common/Badge";
import PriorityIcon from "@/components/common/PriorityIcon";

const statusConfig = {
  todo: { label: "To Do", bg: "bg-slate-100", text: "text-slate-700" },
  in_progress: { label: "In Progress", bg: "bg-warning-100", text: "text-warning-600" },
  done: { label: "Done", bg: "bg-success-100", text: "text-success-700" },
};

const borderColors = {
  low: "border-l-success-500",
  medium: "border-l-warning-500",
  high: "border-l-danger-500",
};

export default function TaskCard({ task }: { task: Task }) {
  const dispatch = useAppDispatch();
  const tags = useAppSelector((s) => s.tags.items);
  const groups = useAppSelector((s) => s.groups.items);
  const group = groups.find((g) => g.id === task.groupId);
  const taskTags = tags.filter((t) => task.tagIds.includes(t.id));
  const status = statusConfig[task.status];
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const nextStatus = task.status === "todo" ? "in_progress" : task.status === "in_progress" ? "done" : "todo";

  return (
    <div
      onClick={() => dispatch(setEditingTaskId(task.id))}
      className={`group cursor-pointer rounded-xl border border-border border-l-4 ${borderColors[task.priority]} bg-surface p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className={`text-sm font-semibold text-text-primary ${task.status === "done" ? "line-through opacity-60" : ""}`}>
          {task.title}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(updateTask({ id: task.id, status: nextStatus }));
          }}
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${status.bg} ${status.text} hover:opacity-80`}
        >
          {status.label}
        </button>
      </div>

      {task.description && (
        <p className="mb-3 line-clamp-2 text-xs text-text-secondary">{task.description}</p>
      )}

      {/* Progress bar */}
      {totalSubtasks > 0 && (
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between text-xs text-text-tertiary">
            <span>Subtasks</span>
            <span>{completedSubtasks}/{totalSubtasks}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-tertiary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <PriorityIcon priority={task.priority} />
        {group && <Badge label={group.name} color={group.color} variant="outline" />}
        {taskTags.map((tag) => (
          <Badge key={tag.id} label={tag.name} color={tag.color} />
        ))}
        {task.dueDate && (
          <span className="ml-auto text-xs text-text-tertiary">
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
