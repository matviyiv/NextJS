import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { Task, Subtask } from "@/types";

interface TasksState {
  items: Task[];
}

const initialState: TasksState = {
  items: [],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<Omit<Task, "id" | "createdAt" | "updatedAt" | "subtasks"> & { subtasks?: Subtask[] }>) {
      const now = new Date().toISOString();
      state.items.push({
        ...action.payload,
        id: uuidv4(),
        subtasks: action.payload.subtasks || [],
        createdAt: now,
        updatedAt: now,
      });
    },
    updateTask(state, action: PayloadAction<{ id: string } & Partial<Omit<Task, "id" | "createdAt">>>) {
      const index = state.items.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteTask(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    addSubtask(state, action: PayloadAction<{ taskId: string; title: string }>) {
      const task = state.items.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.subtasks.push({
          id: uuidv4(),
          title: action.payload.title,
          completed: false,
        });
        task.updatedAt = new Date().toISOString();
      }
    },
    toggleSubtask(state, action: PayloadAction<{ taskId: string; subtaskId: string }>) {
      const task = state.items.find((t) => t.id === action.payload.taskId);
      if (task) {
        const subtask = task.subtasks.find((s) => s.id === action.payload.subtaskId);
        if (subtask) {
          subtask.completed = !subtask.completed;
          task.updatedAt = new Date().toISOString();
        }
      }
    },
    deleteSubtask(state, action: PayloadAction<{ taskId: string; subtaskId: string }>) {
      const task = state.items.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.subtasks = task.subtasks.filter((s) => s.id !== action.payload.subtaskId);
        task.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const { addTask, updateTask, deleteTask, addSubtask, toggleSubtask, deleteSubtask } =
  tasksSlice.actions;
export default tasksSlice.reducer;
