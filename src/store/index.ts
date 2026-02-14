import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import tasksReducer from "./slices/tasksSlice";
import groupsReducer from "./slices/groupsSlice";
import tagsReducer from "./slices/tagsSlice";
import uiReducer from "./slices/uiSlice";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  groups: groupsReducer,
  tags: tagsReducer,
  ui: uiReducer,
});

const persistConfig = {
  key: "taskflow",
  version: 1,
  storage,
  whitelist: ["tasks", "groups", "tags", "ui"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
  const persistor = persistStore(store);
  return { store, persistor };
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof makeStore>["store"];
export type AppDispatch = AppStore["dispatch"];
