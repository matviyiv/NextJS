"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useAppSelector";
import { setViewMode, setFilters, clearFilters, toggleDarkMode } from "@/store/slices/uiSlice";
import { ViewMode } from "@/types";

const viewModes: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
  {
    mode: "list",
    label: "List",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    mode: "board",
    label: "Board",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    mode: "group",
    label: "Groups",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
    ),
  },
  {
    mode: "tag",
    label: "Tags",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector((s) => s.ui.viewMode);
  const darkMode = useAppSelector((s) => s.ui.darkMode);
  const groups = useAppSelector((s) => s.groups.items);
  const tags = useAppSelector((s) => s.tags.items);
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);

  return (
    <aside
      className={`flex h-full flex-col border-r border-border bg-surface transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        {sidebarOpen && (
          <span className="text-lg font-bold text-text-primary">TaskFlow</span>
        )}
      </div>

      {/* Views */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="mb-6">
          {sidebarOpen && (
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              Views
            </p>
          )}
          {viewModes.map(({ mode, label, icon }) => (
            <button
              key={mode}
              onClick={() => {
                dispatch(setViewMode(mode));
                dispatch(clearFilters());
              }}
              className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === mode
                  ? "bg-primary-50 text-primary-700"
                  : "text-text-secondary hover:bg-surface-tertiary hover:text-text-primary"
              }`}
            >
              {icon}
              {sidebarOpen && label}
            </button>
          ))}
        </div>

        {/* Groups */}
        {sidebarOpen && (
          <div className="mb-6">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              Groups
            </p>
            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() => {
                  dispatch(setViewMode("group"));
                  dispatch(setFilters({ groupId: group.id }));
                }}
                className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-tertiary hover:text-text-primary"
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
                {group.name}
              </button>
            ))}
          </div>
        )}

        {/* Tags */}
        {sidebarOpen && (
          <div className="mb-6">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              Tags
            </p>
            <div className="flex flex-wrap gap-1.5 px-3">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => {
                    dispatch(setViewMode("tag"));
                    dispatch(setFilters({ tagIds: [tag.id] }));
                  }}
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Dark mode toggle */}
      <div className="border-t border-border p-3">
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-tertiary hover:text-text-primary"
        >
          {darkMode ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          )}
          {sidebarOpen && (darkMode ? "Light Mode" : "Dark Mode")}
        </button>
      </div>
    </aside>
  );
}
