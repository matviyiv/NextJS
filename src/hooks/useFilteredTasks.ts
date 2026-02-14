"use client";

import { useMemo } from "react";
import { useAppSelector } from "./useAppSelector";
import { Task } from "@/types";

const priorityOrder = { high: 0, medium: 1, low: 2 };

export function useFilteredTasks(): Task[] {
  const tasks = useAppSelector((s) => s.tasks.items);
  const { sortField, sortDirection, filters } = useAppSelector((s) => s.ui);

  return useMemo(() => {
    let result = [...tasks];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }
    if (filters.status.length > 0) {
      result = result.filter((t) => filters.status.includes(t.status));
    }
    if (filters.priority.length > 0) {
      result = result.filter((t) => filters.priority.includes(t.priority));
    }
    if (filters.groupId) {
      result = result.filter((t) => t.groupId === filters.groupId);
    }
    if (filters.tagIds.length > 0) {
      result = result.filter((t) =>
        filters.tagIds.some((tagId) => t.tagIds.includes(tagId))
      );
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "priority":
          cmp = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case "title":
          cmp = a.title.localeCompare(b.title);
          break;
        case "dueDate":
          cmp = (a.dueDate || "9999").localeCompare(b.dueDate || "9999");
          break;
        case "updatedAt":
          cmp = a.updatedAt.localeCompare(b.updatedAt);
          break;
        default:
          cmp = a.createdAt.localeCompare(b.createdAt);
      }
      return sortDirection === "asc" ? cmp : -cmp;
    });

    return result;
  }, [tasks, sortField, sortDirection, filters]);
}
