import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ViewMode, SortField, SortDirection, FilterState } from "@/types";

interface UiState {
  viewMode: ViewMode;
  sortField: SortField;
  sortDirection: SortDirection;
  filters: FilterState;
  sidebarOpen: boolean;
  darkMode: boolean;
  editingTaskId: string | null;
}

const initialState: UiState = {
  viewMode: "list",
  sortField: "createdAt",
  sortDirection: "desc",
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

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setViewMode(state, action: PayloadAction<ViewMode>) {
      state.viewMode = action.payload;
    },
    setSortField(state, action: PayloadAction<SortField>) {
      if (state.sortField === action.payload) {
        state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
      } else {
        state.sortField = action.payload;
        state.sortDirection = "desc";
      }
    },
    setFilters(state, action: PayloadAction<Partial<FilterState>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters(state) {
      state.filters = initialState.filters;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
    },
    setEditingTaskId(state, action: PayloadAction<string | null>) {
      state.editingTaskId = action.payload;
    },
  },
});

export const {
  setViewMode,
  setSortField,
  setFilters,
  clearFilters,
  toggleSidebar,
  toggleDarkMode,
  setEditingTaskId,
} = uiSlice.actions;
export default uiSlice.reducer;
