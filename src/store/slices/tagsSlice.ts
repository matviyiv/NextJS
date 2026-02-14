import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { Tag } from "@/types";

interface TagsState {
  items: Tag[];
}

const initialState: TagsState = {
  items: [
    { id: uuidv4(), name: "Urgent", color: "#f43f5e" },
    { id: uuidv4(), name: "Feature", color: "#6366f1" },
    { id: uuidv4(), name: "Bug", color: "#f59e0b" },
  ],
};

const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    addTag(state, action: PayloadAction<Omit<Tag, "id">>) {
      state.items.push({ ...action.payload, id: uuidv4() });
    },
    updateTag(state, action: PayloadAction<Tag>) {
      const index = state.items.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteTag(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addTag, updateTag, deleteTag } = tagsSlice.actions;
export default tagsSlice.reducer;
