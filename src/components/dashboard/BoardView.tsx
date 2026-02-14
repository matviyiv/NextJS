"use client";

import { useFilteredTasks } from "@/hooks/useFilteredTasks";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { updateTask } from "@/store/slices/tasksSlice";
import { Task } from "@/types";
import TaskCard from "@/components/tasks/TaskCard";

const columns: { status: Task["status"]; label: string; color: string }[] = [
  { status: "todo", label: "To Do", color: "bg-slate-400" },
  { status: "in_progress", label: "In Progress", color: "bg-warning-500" },
  { status: "done", label: "Done", color: "bg-success-500" },
];

export default function BoardView() {
  const tasks = useFilteredTasks();
  const dispatch = useAppDispatch();

  const handleDrop = (e: React.DragEvent, status: Task["status"]) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      dispatch(updateTask({ id: taskId, status }));
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);
        return (
          <div
            key={col.status}
            className="flex w-80 shrink-0 flex-col rounded-xl bg-surface-secondary p-3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, col.status)}
          >
            <div className="mb-3 flex items-center gap-2 px-1">
              <span className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
              <h3 className="text-sm font-semibold text-text-primary">{col.label}</h3>
              <span className="ml-auto rounded-full bg-surface-tertiary px-2 py-0.5 text-xs font-medium text-text-tertiary">
                {colTasks.length}
              </span>
            </div>
            <div className="flex-1 space-y-2">
              {colTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <TaskCard task={task} />
                </div>
              ))}
              {colTasks.length === 0 && (
                <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-border text-xs text-text-tertiary">
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
