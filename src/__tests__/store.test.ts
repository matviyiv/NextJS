import { makeStore } from "@/store";
import { addTask, deleteTask } from "@/store/slices/tasksSlice";
import { addGroup, deleteGroup } from "@/store/slices/groupsSlice";
import { addTag, deleteTag } from "@/store/slices/tagsSlice";
import { toggleDarkMode, setViewMode, toggleSidebar } from "@/store/slices/uiSlice";

describe("store integration", () => {
  it("should create a store with all slices", () => {
    const { store } = makeStore();
    const state = store.getState();
    expect(state).toHaveProperty("tasks");
    expect(state).toHaveProperty("groups");
    expect(state).toHaveProperty("tags");
    expect(state).toHaveProperty("ui");
  });

  it("should have correct initial state shape", () => {
    const { store } = makeStore();
    const state = store.getState();
    expect(state.tasks.items).toEqual([]);
    expect(state.groups.items).toHaveLength(3);
    expect(state.tags.items).toHaveLength(3);
    expect(state.ui.viewMode).toBe("list");
    expect(state.ui.darkMode).toBe(false);
    expect(state.ui.sidebarOpen).toBe(false);
  });

  it("should dispatch actions across slices independently", () => {
    const { store } = makeStore();

    store.dispatch(addTask({
      title: "Integration test task",
      status: "todo",
      priority: "high",
      tagIds: [],
    }));
    store.dispatch(toggleDarkMode());
    store.dispatch(setViewMode("board"));

    const state = store.getState();
    expect(state.tasks.items).toHaveLength(1);
    expect(state.tasks.items[0].title).toBe("Integration test task");
    expect(state.ui.darkMode).toBe(true);
    expect(state.ui.viewMode).toBe("board");
  });

  it("should handle a full task lifecycle", () => {
    const { store } = makeStore();

    // Add task
    store.dispatch(addTask({
      title: "Lifecycle task",
      status: "todo",
      priority: "medium",
      tagIds: [],
    }));
    expect(store.getState().tasks.items).toHaveLength(1);
    const taskId = store.getState().tasks.items[0].id;

    // Delete task
    store.dispatch(deleteTask(taskId));
    expect(store.getState().tasks.items).toHaveLength(0);
  });

  it("should handle a full group lifecycle", () => {
    const { store } = makeStore();
    const initialCount = store.getState().groups.items.length;

    store.dispatch(addGroup({ name: "Test Group", color: "#ff0000" }));
    expect(store.getState().groups.items).toHaveLength(initialCount + 1);

    const groupId = store.getState().groups.items[initialCount].id;
    store.dispatch(deleteGroup(groupId));
    expect(store.getState().groups.items).toHaveLength(initialCount);
  });

  it("should handle a full tag lifecycle", () => {
    const { store } = makeStore();
    const initialCount = store.getState().tags.items.length;

    store.dispatch(addTag({ name: "Test Tag", color: "#00ff00" }));
    expect(store.getState().tags.items).toHaveLength(initialCount + 1);

    const tagId = store.getState().tags.items[initialCount].id;
    store.dispatch(deleteTag(tagId));
    expect(store.getState().tags.items).toHaveLength(initialCount);
  });

  it("should toggle UI state correctly", () => {
    const { store } = makeStore();

    store.dispatch(toggleSidebar());
    expect(store.getState().ui.sidebarOpen).toBe(true);

    store.dispatch(toggleSidebar());
    expect(store.getState().ui.sidebarOpen).toBe(false);

    store.dispatch(toggleDarkMode());
    expect(store.getState().ui.darkMode).toBe(true);
  });

  it("should return a persistor from makeStore", () => {
    const { persistor } = makeStore();
    expect(persistor).toBeDefined();
    expect(typeof persistor.persist).toBe("function");
    expect(typeof persistor.purge).toBe("function");
  });
});
