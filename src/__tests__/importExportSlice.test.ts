import tasksReducer, { addTask, importTasks } from "@/store/slices/tasksSlice";
import { Task } from "@/types";

describe("tasksSlice – importTasks", () => {
  const emptyState = { items: [] as Task[] };

  const sampleTask: Task = {
    id: "import-1",
    title: "Imported Task",
    description: "From JSON",
    status: "todo",
    priority: "high",
    tagIds: ["tag-1"],
    subtasks: [{ id: "sub-1", title: "Step 1", completed: false }],
    createdAt: "2025-06-01T00:00:00.000Z",
    updatedAt: "2025-06-01T00:00:00.000Z",
    dueDate: "2025-12-31",
  };

  it("imports tasks into empty state", () => {
    const state = tasksReducer(emptyState, importTasks([sampleTask]));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].title).toBe("Imported Task");
    expect(state.items[0].subtasks).toHaveLength(1);
  });

  it("imports multiple tasks at once", () => {
    const tasks: Task[] = [
      { ...sampleTask, id: "a", title: "Task A" },
      { ...sampleTask, id: "b", title: "Task B" },
      { ...sampleTask, id: "c", title: "Task C" },
    ];
    const state = tasksReducer(emptyState, importTasks(tasks));
    expect(state.items).toHaveLength(3);
    expect(state.items.map((t) => t.title)).toEqual(["Task A", "Task B", "Task C"]);
  });

  it("assigns new ids to avoid collisions with existing tasks", () => {
    // Start with an existing task
    let state = tasksReducer(emptyState, addTask({
      title: "Existing",
      status: "todo",
      priority: "low",
      tagIds: [],
    }));
    const existingId = state.items[0].id;

    // Import a task — it should get a new unique id
    state = tasksReducer(state, importTasks([sampleTask]));
    expect(state.items).toHaveLength(2);
    expect(state.items[1].id).not.toBe(sampleTask.id);
    expect(state.items[1].id).not.toBe(existingId);
    expect(state.items[1].title).toBe("Imported Task");
  });

  it("assigns new ids to subtasks as well", () => {
    const state = tasksReducer(emptyState, importTasks([sampleTask]));
    expect(state.items[0].subtasks[0].id).not.toBe("sub-1");
    expect(state.items[0].subtasks[0].title).toBe("Step 1");
    expect(state.items[0].subtasks[0].completed).toBe(false);
  });

  it("preserves all task fields except ids and timestamps", () => {
    const state = tasksReducer(emptyState, importTasks([sampleTask]));
    const imported = state.items[0];
    expect(imported.title).toBe("Imported Task");
    expect(imported.description).toBe("From JSON");
    expect(imported.status).toBe("todo");
    expect(imported.priority).toBe("high");
    expect(imported.tagIds).toEqual(["tag-1"]);
    expect(imported.dueDate).toBe("2025-12-31");
  });

  it("sets fresh createdAt and updatedAt timestamps", () => {
    const before = new Date().toISOString();
    const state = tasksReducer(emptyState, importTasks([sampleTask]));
    const after = new Date().toISOString();
    const imported = state.items[0];
    expect(imported.createdAt >= before).toBe(true);
    expect(imported.createdAt <= after).toBe(true);
    expect(imported.updatedAt >= before).toBe(true);
  });

  it("handles importing tasks with no subtasks", () => {
    const noSubtasks: Task = { ...sampleTask, subtasks: [] };
    const state = tasksReducer(emptyState, importTasks([noSubtasks]));
    expect(state.items[0].subtasks).toEqual([]);
  });

  it("handles importing tasks with no optional fields", () => {
    const minimal: Task = {
      id: "min",
      title: "Minimal",
      status: "todo",
      priority: "low",
      tagIds: [],
      subtasks: [],
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2025-01-01T00:00:00.000Z",
    };
    const state = tasksReducer(emptyState, importTasks([minimal]));
    expect(state.items[0].title).toBe("Minimal");
    expect(state.items[0].description).toBeUndefined();
    expect(state.items[0].groupId).toBeUndefined();
    expect(state.items[0].dueDate).toBeUndefined();
  });

  it("does nothing when importing an empty array", () => {
    const state = tasksReducer(emptyState, importTasks([]));
    expect(state.items).toHaveLength(0);
  });
});
