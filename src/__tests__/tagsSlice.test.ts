import tagsReducer, {
  addTag,
  updateTag,
  deleteTag,
} from "@/store/slices/tagsSlice";

describe("tagsSlice", () => {
  it("should return initial state with default tags", () => {
    const state = tagsReducer(undefined, { type: "unknown" });
    expect(state.items).toHaveLength(3);
    expect(state.items.map((t) => t.name)).toEqual(["Urgent", "Feature", "Bug"]);
  });

  it("should add a tag", () => {
    const state = tagsReducer(undefined, { type: "unknown" });
    const next = tagsReducer(state, addTag({ name: "Enhancement", color: "#22c55e" }));
    expect(next.items).toHaveLength(4);
    expect(next.items[3].name).toBe("Enhancement");
    expect(next.items[3].color).toBe("#22c55e");
    expect(next.items[3].id).toBeDefined();
  });

  it("should update a tag", () => {
    const state = tagsReducer(undefined, { type: "unknown" });
    const id = state.items[0].id;
    const next = tagsReducer(state, updateTag({ id, name: "Critical", color: "#dc2626" }));
    expect(next.items[0].name).toBe("Critical");
    expect(next.items[0].color).toBe("#dc2626");
  });

  it("should not update a non-existent tag", () => {
    const state = tagsReducer(undefined, { type: "unknown" });
    const next = tagsReducer(state, updateTag({ id: "fake-id", name: "Nope", color: "#fff" }));
    expect(next).toEqual(state);
  });

  it("should delete a tag", () => {
    const state = tagsReducer(undefined, { type: "unknown" });
    const id = state.items[2].id;
    const next = tagsReducer(state, deleteTag(id));
    expect(next.items).toHaveLength(2);
    expect(next.items.find((t) => t.id === id)).toBeUndefined();
  });

  it("should not remove anything when deleting non-existent id", () => {
    const state = tagsReducer(undefined, { type: "unknown" });
    const next = tagsReducer(state, deleteTag("fake-id"));
    expect(next.items).toHaveLength(3);
  });
});
