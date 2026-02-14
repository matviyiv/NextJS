"use client";

import { useState } from "react";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { addSubtask, toggleSubtask, deleteSubtask } from "@/store/slices/tasksSlice";
import { Subtask } from "@/types";

interface SubtaskListProps {
  taskId: string;
  subtasks: Subtask[];
}

export default function SubtaskList({ taskId, subtasks }: SubtaskListProps) {
  const dispatch = useAppDispatch();
  const [newTitle, setNewTitle] = useState("");

  const handleAdd = () => {
    const title = newTitle.trim();
    if (!title) return;
    dispatch(addSubtask({ taskId, title }));
    setNewTitle("");
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-text-primary">
        Subtasks ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
      </label>
      <div className="space-y-1">
        {subtasks.map((subtask) => (
          <div
            key={subtask.id}
            className="group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-surface-tertiary"
          >
            <input
              type="checkbox"
              checked={subtask.completed}
              onChange={() => dispatch(toggleSubtask({ taskId, subtaskId: subtask.id }))}
              className="h-4 w-4 shrink-0 rounded border-border text-primary-600 focus:ring-primary-500"
            />
            <span
              className={`flex-1 text-sm transition-all ${
                subtask.completed
                  ? "text-text-tertiary line-through"
                  : "text-text-primary"
              }`}
            >
              {subtask.title}
            </span>
            <button
              onClick={() => dispatch(deleteSubtask({ taskId, subtaskId: subtask.id }))}
              className="opacity-0 transition-opacity group-hover:opacity-100"
            >
              <svg className="h-4 w-4 text-text-tertiary hover:text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          placeholder="Add subtask..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="flex-1 rounded-lg border border-border bg-surface-secondary px-3 py-1.5 text-sm text-text-primary placeholder-text-tertiary focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
        <button
          onClick={handleAdd}
          className="rounded-lg bg-surface-tertiary px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-primary-100 hover:text-primary-700"
        >
          Add
        </button>
      </div>
    </div>
  );
}
