import uiReducer, {
  setViewMode,
  setSortField,
  setFilters,
  clearFilters,
  toggleSidebar,
  toggleDarkMode,
  setEditingTaskId,
} from "@/store/slices/uiSlice";

describe("uiSlice", () => {
  const initialState = {
    viewMode: "list" as const,
    sortField: "createdAt" as const,
    sortDirection: "desc" as const,
    filters: {
      status: [],
      priority: [],
      groupId: null,
      tagIds: [],
      search: "",
    },
    sidebarOpen: false,
    darkMode: false,
    editingTaskId: null,
  };

  it("should return initial state", () => {
    expect(uiReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should set view mode", () => {
    const state = uiReducer(initialState, setViewMode("board"));
    expect(state.viewMode).toBe("board");
  });

  it("should set sort field and toggle direction on same field", () => {
    let state = uiReducer(initialState, setSortField("priority"));
    expect(state.sortField).toBe("priority");
    expect(state.sortDirection).toBe("desc");

    // Same field again should toggle direction
    state = uiReducer(state, setSortField("priority"));
    expect(state.sortField).toBe("priority");
    expect(state.sortDirection).toBe("asc");
  });

  it("should set filters", () => {
    const state = uiReducer(initialState, setFilters({ search: "test", status: ["todo"] }));
    expect(state.filters.search).toBe("test");
    expect(state.filters.status).toEqual(["todo"]);
    // Other filters untouched
    expect(state.filters.priority).toEqual([]);
  });

  it("should clear filters", () => {
    let state = uiReducer(initialState, setFilters({ search: "test" }));
    state = uiReducer(state, clearFilters());
    expect(state.filters).toEqual(initialState.filters);
  });

  it("should toggle sidebar", () => {
    let state = uiReducer(initialState, toggleSidebar());
    expect(state.sidebarOpen).toBe(true);

    state = uiReducer(state, toggleSidebar());
    expect(state.sidebarOpen).toBe(false);
  });

  it("should toggle dark mode", () => {
    let state = uiReducer(initialState, toggleDarkMode());
    expect(state.darkMode).toBe(true);

    state = uiReducer(state, toggleDarkMode());
    expect(state.darkMode).toBe(false);
  });

  it("should set editing task id", () => {
    const state = uiReducer(initialState, setEditingTaskId("task-123"));
    expect(state.editingTaskId).toBe("task-123");

    const cleared = uiReducer(state, setEditingTaskId(null));
    expect(cleared.editingTaskId).toBeNull();
  });
});
