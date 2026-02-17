"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useAppSelector";
import { deleteTask } from "@/store/slices/tasksSlice";
import { setEditingTaskId } from "@/store/slices/uiSlice";
import SubtaskList from "./SubtaskList";
import TaskForm from "./TaskForm";
import { useState } from "react";

export default function TaskDetail() {
  const dispatch = useAppDispatch();
  const editingTaskId = useAppSelector((s) => s.ui.editingTaskId);
  const task = useAppSelector((s) =>
    s.tasks.items.find((t) => t.id === editingTaskId)
  );
  const groups = useAppSelector((s) => s.groups.items);
  const tags = useAppSelector((s) => s.tags.items);
  const [showEditForm, setShowEditForm] = useState(false);

  if (!task) return null;

  const group = groups.find((g) => g.id === task.groupId);
  const taskTags = tags.filter((t) => task.tagIds.includes(t.id));

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
    dispatch(setEditingTaskId(null));
  };

  const handleClose = () => {
    setShowEditForm(false);
    dispatch(setEditingTaskId(null));
  };

  // Show the edit form as a modal on top
  if (showEditForm) {
    return (
      <TaskForm
        open={true}
        onClose={() => setShowEditForm(false)}
        existingTask={task}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="mx-4 w-full max-w-lg animate-scale-in rounded-2xl bg-surface p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h2 className="text-lg font-semibold text-text-primary">{task.title}</h2>
            {task.description && (
              <p className="mt-1 text-sm text-text-secondary">{task.description}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="shrink-0 rounded-lg p-1.5 text-text-tertiary transition-colors hover:bg-surface-tertiary hover:text-text-primary"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Metadata */}
        <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-text-tertiary">Status:</span>{" "}
            <span className="font-medium text-text-primary capitalize">{task.status.replace("_", " ")}</span>
          </div>
          <div>
            <span className="text-text-tertiary">Priority:</span>{" "}
            <span className="font-medium text-text-primary capitalize">{task.priority}</span>
          </div>
          {group && (
            <div>
              <span className="text-text-tertiary">Group:</span>{" "}
              <span className="font-medium text-text-primary">{group.name}</span>
            </div>
          )}
          {task.dueDate && (
            <div>
              <span className="text-text-tertiary">Due:</span>{" "}
              <span className="font-medium text-text-primary">{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {taskTags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {taskTags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Subtasks */}
        <div className="mb-4">
          <SubtaskList taskId={task.id} subtasks={task.subtasks} />
        </div>

        {/* Timestamps */}
        <div className="mb-4 border-t border-border pt-3 text-xs text-text-tertiary">
          <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
          <p>Updated: {new Date(task.updatedAt).toLocaleString()}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            onClick={handleDelete}
            className="rounded-lg px-4 py-2 text-sm font-medium text-danger-600 transition-colors hover:bg-danger-50"
          >
            Delete
          </button>
          <button
            onClick={() => setShowEditForm(true)}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-700"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
