import { exportTasksToJson, parseTasksFromJson } from "@/utils/taskExportImport";
import { Task } from "@/types";

const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Task One",
    description: "First task",
    status: "todo",
    priority: "high",
    tagIds: ["t1"],
    subtasks: [{ id: "s1", title: "Sub 1", completed: true }],
    createdAt: "2025-06-01T00:00:00.000Z",
    updatedAt: "2025-06-01T00:00:00.000Z",
    dueDate: "2025-12-31",
  },
  {
    id: "2",
    title: "Task Two",
    status: "done",
    priority: "low",
    tagIds: [],
    subtasks: [],
    createdAt: "2025-06-02T00:00:00.000Z",
    updatedAt: "2025-06-02T00:00:00.000Z",
  },
];

describe("exportTasksToJson", () => {
  it("returns valid JSON string", () => {
    const json = exportTasksToJson(sampleTasks);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it("exports all tasks", () => {
    const json = exportTasksToJson(sampleTasks);
    const parsed = JSON.parse(json);
    expect(parsed.tasks).toHaveLength(2);
  });

  it("includes version metadata", () => {
    const json = exportTasksToJson(sampleTasks);
    const parsed = JSON.parse(json);
    expect(parsed.version).toBe(1);
  });

  it("includes export timestamp", () => {
    const before = new Date().toISOString();
    const json = exportTasksToJson(sampleTasks);
    const after = new Date().toISOString();
    const parsed = JSON.parse(json);
    expect(parsed.exportedAt >= before).toBe(true);
    expect(parsed.exportedAt <= after).toBe(true);
  });

  it("preserves all task fields", () => {
    const json = exportTasksToJson(sampleTasks);
    const parsed = JSON.parse(json);
    const task = parsed.tasks[0];
    expect(task.title).toBe("Task One");
    expect(task.description).toBe("First task");
    expect(task.status).toBe("todo");
    expect(task.priority).toBe("high");
    expect(task.tagIds).toEqual(["t1"]);
    expect(task.subtasks).toHaveLength(1);
    expect(task.dueDate).toBe("2025-12-31");
  });

  it("exports only selected tasks when ids provided", () => {
    const json = exportTasksToJson(sampleTasks, ["2"]);
    const parsed = JSON.parse(json);
    expect(parsed.tasks).toHaveLength(1);
    expect(parsed.tasks[0].title).toBe("Task Two");
  });

  it("exports empty array when no tasks match ids", () => {
    const json = exportTasksToJson(sampleTasks, ["nonexistent"]);
    const parsed = JSON.parse(json);
    expect(parsed.tasks).toHaveLength(0);
  });

  it("exports all when no ids filter provided", () => {
    const json = exportTasksToJson(sampleTasks);
    const parsed = JSON.parse(json);
    expect(parsed.tasks).toHaveLength(2);
  });
});

describe("parseTasksFromJson", () => {
  it("parses valid exported JSON", () => {
    const json = exportTasksToJson(sampleTasks);
    const result = parseTasksFromJson(json);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.tasks).toHaveLength(2);
      expect(result.tasks[0].title).toBe("Task One");
    }
  });

  it("returns error for invalid JSON syntax", () => {
    const result = parseTasksFromJson("not json{{{");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/invalid json/i);
    }
  });

  it("returns error for JSON without tasks array", () => {
    const result = parseTasksFromJson(JSON.stringify({ version: 1 }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/tasks/i);
    }
  });

  it("returns error when tasks is not an array", () => {
    const result = parseTasksFromJson(JSON.stringify({ version: 1, tasks: "not array" }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/tasks/i);
    }
  });

  it("returns error when a task is missing required title", () => {
    const bad = JSON.stringify({
      version: 1,
      tasks: [{ id: "1", status: "todo", priority: "low", tagIds: [], subtasks: [] }],
    });
    const result = parseTasksFromJson(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/title/i);
    }
  });

  it("returns error when a task has invalid status", () => {
    const bad = JSON.stringify({
      version: 1,
      tasks: [{
        id: "1", title: "Bad", status: "invalid", priority: "low",
        tagIds: [], subtasks: [],
        createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z",
      }],
    });
    const result = parseTasksFromJson(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/status/i);
    }
  });

  it("returns error when a task has invalid priority", () => {
    const bad = JSON.stringify({
      version: 1,
      tasks: [{
        id: "1", title: "Bad", status: "todo", priority: "critical",
        tagIds: [], subtasks: [],
        createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z",
      }],
    });
    const result = parseTasksFromJson(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/priority/i);
    }
  });

  it("accepts a plain array of tasks (without wrapper)", () => {
    const json = JSON.stringify(sampleTasks);
    const result = parseTasksFromJson(json);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.tasks).toHaveLength(2);
    }
  });

  it("preserves subtask data", () => {
    const json = exportTasksToJson(sampleTasks);
    const result = parseTasksFromJson(json);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.tasks[0].subtasks[0].title).toBe("Sub 1");
      expect(result.tasks[0].subtasks[0].completed).toBe(true);
    }
  });
});
