import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import tasksReducer from "@/store/slices/tasksSlice";
import groupsReducer from "@/store/slices/groupsSlice";
import tagsReducer from "@/store/slices/tagsSlice";
import uiReducer from "@/store/slices/uiSlice";
import type { RootState } from "@/store";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  groups: groupsReducer,
  tags: tagsReducer,
  ui: uiReducer,
});

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
}

export function renderWithStore(
  ui: React.ReactElement,
  { preloadedState, ...renderOptions }: ExtendedRenderOptions = {}
) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as RootState,
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
