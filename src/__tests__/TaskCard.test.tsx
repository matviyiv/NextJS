import { screen, fireEvent } from "@testing-library/react";
import TaskCard from "@/components/tasks/TaskCard";
import { renderWithStore } from "./test-utils";
import { Task } from "@/types";

const baseTask: Task = {
  id: "task-1",
  title: "Test Task",
  description: "A test description",
  status: "todo",
  priority: "medium",
  tagIds: [],
  subtasks: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("TaskCard", () => {
  it("renders task title and description", () => {
    renderWithStore(<TaskCard task={baseTask} />);
    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("A test description")).toBeInTheDocument();
  });

  it("renders status badge with correct label", () => {
    renderWithStore(<TaskCard task={baseTask} />);
    expect(screen.getByText("To Do")).toBeInTheDocument();
  });

  it("cycles status on status badge click: todo -> in_progress", () => {
    const { store } = renderWithStore(<TaskCard task={baseTask} />, {
      preloadedState: {
        tasks: { items: [baseTask] },
      },
    });

    fireEvent.click(screen.getByText("To Do"));
    expect(store.getState().tasks.items[0].status).toBe("in_progress");
  });

  it("cycles status: in_progress -> done", () => {
    const inProgressTask = { ...baseTask, status: "in_progress" as const };
    const { store } = renderWithStore(<TaskCard task={inProgressTask} />, {
      preloadedState: {
        tasks: { items: [inProgressTask] },
      },
    });

    fireEvent.click(screen.getByText("In Progress"));
    expect(store.getState().tasks.items[0].status).toBe("done");
  });

  it("cycles status: done -> todo", () => {
    const doneTask = { ...baseTask, status: "done" as const };
    const { store } = renderWithStore(<TaskCard task={doneTask} />, {
      preloadedState: {
        tasks: { items: [doneTask] },
      },
    });

    fireEvent.click(screen.getByText("Done"));
    expect(store.getState().tasks.items[0].status).toBe("todo");
  });

  it("opens task detail on card click (not status button)", () => {
    const { store } = renderWithStore(<TaskCard task={baseTask} />, {
      preloadedState: {
        tasks: { items: [baseTask] },
      },
    });

    // Click on the title text (which is inside the card div)
    fireEvent.click(screen.getByText("Test Task"));
    expect(store.getState().ui.editingTaskId).toBe("task-1");
  });

  it("status click does NOT open task detail (stopPropagation)", () => {
    const { store } = renderWithStore(<TaskCard task={baseTask} />, {
      preloadedState: {
        tasks: { items: [baseTask] },
      },
    });

    fireEvent.click(screen.getByText("To Do"));
    // Status updated, but editingTaskId should NOT be set
    expect(store.getState().tasks.items[0].status).toBe("in_progress");
    expect(store.getState().ui.editingTaskId).toBeNull();
  });

  it("shows subtask progress bar when subtasks exist", () => {
    const taskWithSubtasks: Task = {
      ...baseTask,
      subtasks: [
        { id: "s1", title: "Sub 1", completed: true },
        { id: "s2", title: "Sub 2", completed: false },
      ],
    };
    renderWithStore(<TaskCard task={taskWithSubtasks} />);
    expect(screen.getByText("1/2")).toBeInTheDocument();
    expect(screen.getByText("Subtasks")).toBeInTheDocument();
  });

  it("does NOT show subtask progress when no subtasks", () => {
    renderWithStore(<TaskCard task={baseTask} />);
    expect(screen.queryByText("Subtasks")).not.toBeInTheDocument();
  });

  it("applies line-through on done tasks", () => {
    const doneTask = { ...baseTask, status: "done" as const };
    renderWithStore(<TaskCard task={doneTask} />);
    const title = screen.getByText("Test Task");
    expect(title.className).toContain("line-through");
  });
});
