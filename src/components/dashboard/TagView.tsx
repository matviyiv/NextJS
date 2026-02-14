"use client";

import { useFilteredTasks } from "@/hooks/useFilteredTasks";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppSelector";
import { setFilters } from "@/store/slices/uiSlice";
import TaskCard from "@/components/tasks/TaskCard";

export default function TagView() {
  const tasks = useFilteredTasks();
  const dispatch = useAppDispatch();
  const tags = useAppSelector((s) => s.tags.items);
  const activeTagIds = useAppSelector((s) => s.ui.filters.tagIds);

  const toggleTag = (tagId: string) => {
    const newTagIds = activeTagIds.includes(tagId)
      ? activeTagIds.filter((id) => id !== tagId)
      : [...activeTagIds, tagId];
    dispatch(setFilters({ tagIds: newTagIds }));
  };

  return (
    <div>
      {/* Tag filter bar */}
      <div className="mb-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => toggleTag(tag.id)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
              activeTagIds.includes(tag.id)
                ? "text-white ring-2 ring-offset-2 shadow-sm"
                : "text-white opacity-50 hover:opacity-75"
            }`}
            style={{
              backgroundColor: tag.color,
              ...(activeTagIds.includes(tag.id) ? { ringColor: tag.color } : {}),
            }}
          >
            {tag.name}
          </button>
        ))}
        {activeTagIds.length > 0 && (
          <button
            onClick={() => dispatch(setFilters({ tagIds: [] }))}
            className="rounded-full border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-tertiary"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <p className="py-8 text-center text-sm text-text-tertiary">
            No tasks match the selected tags
          </p>
        )}
      </div>
    </div>
  );
}
