"use client";

import { useFilteredTasks } from "@/hooks/useFilteredTasks";
import { useAppSelector } from "@/hooks/useAppSelector";
import TaskCard from "@/components/tasks/TaskCard";

export default function GroupView() {
  const tasks = useFilteredTasks();
  const groups = useAppSelector((s) => s.groups.items);

  const ungroupedTasks = tasks.filter((t) => !t.groupId);

  return (
    <div className="space-y-6">
      {groups.map((group) => {
        const groupTasks = tasks.filter((t) => t.groupId === group.id);
        return (
          <div key={group.id}>
            <div className="mb-3 flex items-center gap-3">
              <div
                className="h-5 w-1 rounded-full"
                style={{ backgroundColor: group.color }}
              />
              <h3 className="text-sm font-semibold text-text-primary">{group.name}</h3>
              <span className="rounded-full bg-surface-tertiary px-2 py-0.5 text-xs font-medium text-text-tertiary">
                {groupTasks.length}
              </span>
            </div>
            {groupTasks.length > 0 ? (
              <div className="space-y-2 pl-4">
                {groupTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <p className="pl-4 text-sm text-text-tertiary">No tasks in this group</p>
            )}
          </div>
        );
      })}

      {ungroupedTasks.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="h-5 w-1 rounded-full bg-slate-300" />
            <h3 className="text-sm font-semibold text-text-primary">Ungrouped</h3>
            <span className="rounded-full bg-surface-tertiary px-2 py-0.5 text-xs font-medium text-text-tertiary">
              {ungroupedTasks.length}
            </span>
          </div>
          <div className="space-y-2 pl-4">
            {ungroupedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
