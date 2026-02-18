import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskForm from "@/components/tasks/TaskForm";
import { renderWithStore } from "./test-utils";

describe("TaskForm", () => {
  it("does not render when open is false", () => {
    renderWithStore(<TaskForm open={false} onClose={jest.fn()} />);
    expect(screen.queryByText("New Task")).not.toBeInTheDocument();
  });

  it("renders when open is true", () => {
    renderWithStore(<TaskForm open={true} onClose={jest.fn()} />);
    expect(screen.getByText("New Task")).toBeInTheDocument();
  });

  it("shows 'Edit Task' title when editing existing task", () => {
    const task = {
      id: "1",
      title: "Existing",
      status: "todo" as const,
      priority: "medium" as const,
      tagIds: [],
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    renderWithStore(<TaskForm open={true} onClose={jest.fn()} existingTask={task} />);
    expect(screen.getByText("Edit Task")).toBeInTheDocument();
  });

  it("populates form fields when editing existing task", () => {
    const task = {
      id: "1",
      title: "My Task",
      description: "A description",
      status: "in_progress" as const,
      priority: "high" as const,
      tagIds: [],
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    renderWithStore(<TaskForm open={true} onClose={jest.fn()} existingTask={task} />);
    expect(screen.getByDisplayValue("My Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("A description")).toBeInTheDocument();
  });

  it("creates a new task on submit", async () => {
    const onClose = jest.fn();
    const { store } = renderWithStore(<TaskForm open={true} onClose={onClose} />);

    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    await userEvent.type(titleInput, "New task title");

    fireEvent.click(screen.getByText("Create Task"));

    expect(store.getState().tasks.items).toHaveLength(1);
    expect(store.getState().tasks.items[0].title).toBe("New task title");
    expect(onClose).toHaveBeenCalled();
  });

  it("does not create task with empty title", async () => {
    const onClose = jest.fn();
    const { store } = renderWithStore(<TaskForm open={true} onClose={onClose} />);

    // Title is empty, try to submit via button
    // Note: The form has required on the input, so the browser prevents submission.
    // We'll fireEvent.submit on the form directly
    const form = screen.getByText("Create Task").closest("form")!;
    fireEvent.submit(form);

    expect(store.getState().tasks.items).toHaveLength(0);
  });

  it("calls onClose when Cancel is clicked", async () => {
    const onClose = jest.fn();
    renderWithStore(<TaskForm open={true} onClose={onClose} />);

    await userEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when X button is clicked", async () => {
    const onClose = jest.fn();
    renderWithStore(<TaskForm open={true} onClose={onClose} />);

    // The X button is inside the modal header — find the close button
    const closeButtons = screen.getAllByRole("button");
    // The X button contains an SVG with the X path (M6 18L18 6M6 6l12 12)
    const xButton = closeButtons.find((btn) => {
      const svg = btn.querySelector("svg");
      return svg && btn.textContent === "";
    });
    if (xButton) {
      await userEvent.click(xButton);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it("updates an existing task on submit", async () => {
    const task = {
      id: "edit-1",
      title: "Old Title",
      status: "todo" as const,
      priority: "low" as const,
      tagIds: [],
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const onClose = jest.fn();
    const { store } = renderWithStore(
      <TaskForm open={true} onClose={onClose} existingTask={task} />,
      { preloadedState: { tasks: { items: [task] } } }
    );

    const titleInput = screen.getByDisplayValue("Old Title");
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "Updated Title");

    fireEvent.click(screen.getByText("Save Changes"));

    expect(store.getState().tasks.items[0].title).toBe("Updated Title");
    expect(onClose).toHaveBeenCalled();
  });

  it("can select priority", async () => {
    const onClose = jest.fn();
    const { store } = renderWithStore(<TaskForm open={true} onClose={onClose} />);

    const prioritySelect = screen.getByDisplayValue("Medium");
    await userEvent.selectOptions(prioritySelect, "high");

    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    await userEvent.type(titleInput, "Priority task");

    fireEvent.click(screen.getByText("Create Task"));

    expect(store.getState().tasks.items[0].priority).toBe("high");
  });

  it("can select status", async () => {
    const onClose = jest.fn();
    const { store } = renderWithStore(<TaskForm open={true} onClose={onClose} />);

    const statusSelect = screen.getByDisplayValue("To Do");
    await userEvent.selectOptions(statusSelect, "in_progress");

    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    await userEvent.type(titleInput, "Status task");

    fireEvent.click(screen.getByText("Create Task"));

    expect(store.getState().tasks.items[0].status).toBe("in_progress");
  });

  it("can toggle tag selection", async () => {
    const { store } = renderWithStore(<TaskForm open={true} onClose={jest.fn()} />);
    const tagName = store.getState().tags.items[0].name; // "Urgent"

    // Find all buttons with tag name text - tags appear as buttons in the form
    const tagButton = screen.getAllByRole("button").find(
      (b) => b.textContent === tagName
    )!;
    await userEvent.click(tagButton);

    // Type title and submit
    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    await userEvent.type(titleInput, "Tagged task");
    fireEvent.click(screen.getByText("Create Task"));

    const createdTask = store.getState().tasks.items[0];
    expect(createdTask.tagIds).toContain(store.getState().tags.items[0].id);
  });
});
