export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  groupId?: string;
  tagIds: string[];
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

export interface Group {
  id: string;
  name: string;
  color: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export type ViewMode = "list" | "board" | "group" | "tag";
export type SortField = "createdAt" | "updatedAt" | "priority" | "dueDate" | "title";
export type SortDirection = "asc" | "desc";

export interface FilterState {
  status: Task["status"][];
  priority: Task["priority"][];
  groupId: string | null;
  tagIds: string[];
  search: string;
}
