import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { Group } from "@/types";

interface GroupsState {
  items: Group[];
}

const initialState: GroupsState = {
  items: [
    { id: uuidv4(), name: "Personal", color: "#6366f1" },
    { id: uuidv4(), name: "Work", color: "#8b5cf6" },
    { id: uuidv4(), name: "Health", color: "#10b981" },
  ],
};

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    addGroup(state, action: PayloadAction<Omit<Group, "id">>) {
      state.items.push({ ...action.payload, id: uuidv4() });
    },
    updateGroup(state, action: PayloadAction<Group>) {
      const index = state.items.findIndex((g) => g.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteGroup(state, action: PayloadAction<string>) {
      state.items = state.items.filter((g) => g.id !== action.payload);
    },
  },
});

export const { addGroup, updateGroup, deleteGroup } = groupsSlice.actions;
export default groupsSlice.reducer;
