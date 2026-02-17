"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppSelector";
import { addTask, updateTask } from "@/store/slices/tasksSlice";
import { Task } from "@/types";
import Modal from "@/components/common/Modal";

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  existingTask?: Task;
}

const priorities: Task["priority"][] = ["low", "medium", "high"];
const statuses: Task["status"][] = ["todo", "in_progress", "done"];
const priorityLabels = { low: "Low", medium: "Medium", high: "High" };
const statusLabels = { todo: "To Do", in_progress: "In Progress", done: "Done" };

export default function TaskForm({ open, onClose, existingTask }: TaskFormProps) {
  const dispatch = useAppDispatch();
  const groups = useAppSelector((s) => s.groups.items);
  const tags = useAppSelector((s) => s.tags.items);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Task["status"]>("todo");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [groupId, setGroupId] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState("");

  // Reset form state whenever the modal opens or the task being edited changes
  useEffect(() => {
    if (open) {
      setTitle(existingTask?.title || "");
      setDescription(existingTask?.description || "");
      setStatus(existingTask?.status || "todo");
      setPriority(existingTask?.priority || "medium");
      setGroupId(existingTask?.groupId || "");
      setSelectedTags(existingTask?.tagIds || []);
      setDueDate(existingTask?.dueDate || "");
    }
  }, [open, existingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (existingTask) {
      dispatch(
        updateTask({
          id: existingTask.id,
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          priority,
          groupId: groupId || undefined,
          tagIds: selectedTags,
          dueDate: dueDate || undefined,
        })
      );
    } else {
      dispatch(
        addTask({
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          priority,
          groupId: groupId || undefined,
          tagIds: selectedTags,
          dueDate: dueDate || undefined,
        })
      );
    }
    onClose();
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const inputClasses =
    "w-full rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary placeholder-text-tertiary focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-colors";

  return (
    <Modal open={open} onClose={onClose} title={existingTask ? "Edit Task" : "New Task"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">Title</label>
          <input
            type="text"
            required
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClasses}
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">Description</label>
          <textarea
            placeholder="Add more details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={`${inputClasses} resize-none`}
          />
        </div>

        {/* Status & Priority */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as Task["status"])} className={inputClasses}>
              {statuses.map((s) => (
                <option key={s} value={s}>{statusLabels[s]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as Task["priority"])} className={inputClasses}>
              {priorities.map((p) => (
                <option key={p} value={p}>{priorityLabels[p]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Group & Due Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">Group</label>
            <select value={groupId} onChange={(e) => setGroupId(e.target.value)} className={inputClasses}>
              <option value="">No group</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputClasses}
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isSelected = selectedTags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium text-white transition-all ${
                    isSelected ? "ring-2 ring-offset-1" : "opacity-50 hover:opacity-80"
                  }`}
                  style={{
                    backgroundColor: tag.color,
                    ...(isSelected ? { boxShadow: `0 0 0 2px ${tag.color}` } : {}),
                  }}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-tertiary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md active:scale-[0.98]"
          >
            {existingTask ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
