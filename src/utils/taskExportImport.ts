import { Task } from "@/types";

interface ExportEnvelope {
  version: number;
  exportedAt: string;
  tasks: Task[];
}

const VALID_STATUSES = ["todo", "in_progress", "done"];
const VALID_PRIORITIES = ["low", "medium", "high"];

export function exportTasksToJson(tasks: Task[], filterIds?: string[]): string {
  const filtered = filterIds
    ? tasks.filter((t) => filterIds.includes(t.id))
    : tasks;

  const envelope: ExportEnvelope = {
    version: 1,
    exportedAt: new Date().toISOString(),
    tasks: filtered,
  };

  return JSON.stringify(envelope, null, 2);
}

type ParseResult =
  | { ok: true; tasks: Task[] }
  | { ok: false; error: string };

export function parseTasksFromJson(json: string): ParseResult {
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    return { ok: false, error: "Invalid JSON: could not parse the file." };
  }

  let tasks: unknown[];

  // Accept both { tasks: [...] } envelope and plain array
  if (Array.isArray(data)) {
    tasks = data;
  } else if (data && typeof data === "object" && "tasks" in data) {
    const envelope = data as Record<string, unknown>;
    if (!Array.isArray(envelope.tasks)) {
      return { ok: false, error: "Invalid format: \"tasks\" must be an array." };
    }
    tasks = envelope.tasks;
  } else {
    return { ok: false, error: "Invalid format: expected \"tasks\" array." };
  }

  // Validate each task
  for (let i = 0; i < tasks.length; i++) {
    const t = tasks[i] as Record<string, unknown>;
    if (!t || typeof t !== "object") {
      return { ok: false, error: `Task ${i + 1}: not a valid object.` };
    }
    if (typeof t.title !== "string" || !t.title) {
      return { ok: false, error: `Task ${i + 1}: missing or invalid "title".` };
    }
    if (!VALID_STATUSES.includes(t.status as string)) {
      return { ok: false, error: `Task ${i + 1}: invalid "status" (must be todo, in_progress, or done).` };
    }
    if (!VALID_PRIORITIES.includes(t.priority as string)) {
      return { ok: false, error: `Task ${i + 1}: invalid "priority" (must be low, medium, or high).` };
    }
  }

  return { ok: true, tasks: tasks as Task[] };
}
