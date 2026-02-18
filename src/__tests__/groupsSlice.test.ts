import groupsReducer, {
  addGroup,
  updateGroup,
  deleteGroup,
} from "@/store/slices/groupsSlice";

describe("groupsSlice", () => {
  it("should return initial state with default groups", () => {
    const state = groupsReducer(undefined, { type: "unknown" });
    expect(state.items).toHaveLength(3);
    expect(state.items.map((g) => g.name)).toEqual(["Personal", "Work", "Health"]);
  });

  it("should add a group", () => {
    const state = groupsReducer(undefined, { type: "unknown" });
    const next = groupsReducer(state, addGroup({ name: "Shopping", color: "#ef4444" }));
    expect(next.items).toHaveLength(4);
    expect(next.items[3].name).toBe("Shopping");
    expect(next.items[3].color).toBe("#ef4444");
    expect(next.items[3].id).toBeDefined();
  });

  it("should update a group", () => {
    const state = groupsReducer(undefined, { type: "unknown" });
    const id = state.items[0].id;
    const next = groupsReducer(state, updateGroup({ id, name: "Private", color: "#000000" }));
    expect(next.items[0].name).toBe("Private");
    expect(next.items[0].color).toBe("#000000");
  });

  it("should not update a non-existent group", () => {
    const state = groupsReducer(undefined, { type: "unknown" });
    const next = groupsReducer(state, updateGroup({ id: "fake-id", name: "Nope", color: "#fff" }));
    expect(next).toEqual(state);
  });

  it("should delete a group", () => {
    const state = groupsReducer(undefined, { type: "unknown" });
    const id = state.items[1].id;
    const next = groupsReducer(state, deleteGroup(id));
    expect(next.items).toHaveLength(2);
    expect(next.items.find((g) => g.id === id)).toBeUndefined();
  });

  it("should not remove anything when deleting non-existent id", () => {
    const state = groupsReducer(undefined, { type: "unknown" });
    const next = groupsReducer(state, deleteGroup("fake-id"));
    expect(next.items).toHaveLength(3);
  });
});
