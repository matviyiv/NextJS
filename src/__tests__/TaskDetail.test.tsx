import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskDetail from "@/components/tasks/TaskDetail";
import { renderWithStore } from "./test-utils";

const task = {
  id: "detail-1",
  title: "Detail Task",
  description: "A detailed description",
  status: "todo" as const,
  priority: "high" as const,
  tagIds: [],
  subtasks: [],
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
};

const stateWithTask = {
  tasks: { items: [task] },
  ui: {
    viewMode: "list" as const,
    sortField: "createdAt" as const,
    sortDirection: "desc" as const,
    filters: { status: [], priority: [], groupId: null, tagIds: [], search: "" },
    sidebarOpen: false,
    darkMode: false,
    editingTaskId: "detail-1",
  },
};

describe("TaskDetail", () => {
  it("renders nothing when no task is being edited", () => {
    const { container } = renderWithStore(<TaskDetail />);
    expect(container.innerHTML).toBe("");
  });

  it("renders task title and description when editing", () => {
    renderWithStore(<TaskDetail />, { preloadedState: stateWithTask });
    expect(screen.getByText("Detail Task")).toBeInTheDocument();
    expect(screen.getByText("A detailed description")).toBeInTheDocument();
  });

  it("renders task metadata", () => {
    renderWithStore(<TaskDetail />, { preloadedState: stateWithTask });
    expect(screen.getByText("todo")).toBeInTheDocument();
    expect(screen.getByText("high")).toBeInTheDocument();
  });

  it("closes detail when close button (X) is clicked", () => {
    const { store } = renderWithStore(<TaskDetail />, {
      preloadedState: stateWithTask,
    });
    expect(store.getState().ui.editingTaskId).toBe("detail-1");

    // Find the X close button (SVG button with no text)
    const buttons = screen.getAllByRole("button");
    const closeBtn = buttons.find((b) => b.textContent === "")!;
    fireEvent.click(closeBtn);

    expect(store.getState().ui.editingTaskId).toBeNull();
  });

  it("deletes the task when Delete button is clicked", () => {
    const { store } = renderWithStore(<TaskDetail />, {
      preloadedState: stateWithTask,
    });
    expect(store.getState().tasks.items).toHaveLength(1);

    fireEvent.click(screen.getByText("Delete"));

    expect(store.getState().tasks.items).toHaveLength(0);
    expect(store.getState().ui.editingTaskId).toBeNull();
  });

  it("opens edit form when Edit button is clicked", () => {
    renderWithStore(<TaskDetail />, { preloadedState: stateWithTask });

    fireEvent.click(screen.getByText("Edit"));

    // The TaskForm should now be visible with "Edit Task" title
    expect(screen.getByText("Edit Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Detail Task")).toBeInTheDocument();
  });

  it("closes on backdrop click", () => {
    const { store } = renderWithStore(<TaskDetail />, {
      preloadedState: stateWithTask,
    });

    // The backdrop is the outermost div with the onClick handler
    const backdrop = screen.getByText("Detail Task").closest(".fixed")!;
    // Click on the backdrop itself (not the inner content)
    fireEvent.click(backdrop);

    expect(store.getState().ui.editingTaskId).toBeNull();
  });
});
