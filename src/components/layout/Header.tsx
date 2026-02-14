"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useAppSelector";
import { toggleSidebar, setFilters } from "@/store/slices/uiSlice";

interface HeaderProps {
  onAddTask: () => void;
}

export default function Header({ onAddTask }: HeaderProps) {
  const dispatch = useAppDispatch();
  const search = useAppSelector((s) => s.ui.filters.search);
  const taskCount = useAppSelector((s) => s.tasks.items.length);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-tertiary hover:text-text-primary lg:hidden"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-xs text-text-tertiary">{taskCount} task{taskCount !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden sm:block">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
            className="w-64 rounded-lg border border-border bg-surface-secondary py-2 pl-10 pr-4 text-sm text-text-primary placeholder-text-tertiary transition-all focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>

        {/* Add Task */}
        <button
          onClick={onAddTask}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md active:scale-[0.98]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </div>
    </header>
  );
}
