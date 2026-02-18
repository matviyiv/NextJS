import tasksReducer, {
  addTask,
  updateTask,
  deleteTask,
  addSubtask,
  toggleSubtask,
  deleteSubtask,
} from "@/store/slices/tasksSlice";

describe("tasksSlice", () => {
  const emptyState = { items: [] };

  it("should return initial state", () => {
    expect(tasksReducer(undefined, { type: "unknown" })).toEqual(emptyState);
  });

  it("should add a task", () => {
    const task = {
      title: "Test task",
      status: "todo" as const,
      priority: "medium" as const,
      tagIds: [],
    };
    const state = tasksReducer(emptyState, addTask(task));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].title).toBe("Test task");
    expect(state.items[0].status).toBe("todo");
    expect(state.items[0].priority).toBe("medium");
    expect(state.items[0].id).toBeDefined();
    expect(state.items[0].createdAt).toBeDefined();
    expect(state.items[0].subtasks).toEqual([]);
  });

  it("should update a task", () => {
    const task = {
      title: "Original",
      status: "todo" as const,
      priority: "low" as const,
      tagIds: [],
    };
    let state = tasksReducer(emptyState, addTask(task));
    const id = state.items[0].id;

    state = tasksReducer(state, updateTask({ id, title: "Updated", status: "in_progress" }));
    expect(state.items[0].title).toBe("Updated");
    expect(state.items[0].status).toBe("in_progress");
  });

  it("should delete a task", () => {
    const task = {
      title: "To delete",
      status: "todo" as const,
      priority: "low" as const,
      tagIds: [],
    };
    let state = tasksReducer(emptyState, addTask(task));
    const id = state.items[0].id;

    state = tasksReducer(state, deleteTask(id));
    expect(state.items).toHaveLength(0);
  });

  it("should add a subtask", () => {
    const task = {
      title: "Parent",
      status: "todo" as const,
      priority: "high" as const,
      tagIds: [],
    };
    let state = tasksReducer(emptyState, addTask(task));
    const taskId = state.items[0].id;

    state = tasksReducer(state, addSubtask({ taskId, title: "Sub 1" }));
    expect(state.items[0].subtasks).toHaveLength(1);
    expect(state.items[0].subtasks[0].title).toBe("Sub 1");
    expect(state.items[0].subtasks[0].completed).toBe(false);
  });

  it("should toggle a subtask", () => {
    const task = {
      title: "Parent",
      status: "todo" as const,
      priority: "high" as const,
      tagIds: [],
    };
    let state = tasksReducer(emptyState, addTask(task));
    const taskId = state.items[0].id;
    state = tasksReducer(state, addSubtask({ taskId, title: "Sub 1" }));
    const subtaskId = state.items[0].subtasks[0].id;

    state = tasksReducer(state, toggleSubtask({ taskId, subtaskId }));
    expect(state.items[0].subtasks[0].completed).toBe(true);

    state = tasksReducer(state, toggleSubtask({ taskId, subtaskId }));
    expect(state.items[0].subtasks[0].completed).toBe(false);
  });

  it("should delete a subtask", () => {
    const task = {
      title: "Parent",
      status: "todo" as const,
      priority: "high" as const,
      tagIds: [],
    };
    let state = tasksReducer(emptyState, addTask(task));
    const taskId = state.items[0].id;
    state = tasksReducer(state, addSubtask({ taskId, title: "Sub 1" }));
    const subtaskId = state.items[0].subtasks[0].id;

    state = tasksReducer(state, deleteSubtask({ taskId, subtaskId }));
    expect(state.items[0].subtasks).toHaveLength(0);
  });
});
