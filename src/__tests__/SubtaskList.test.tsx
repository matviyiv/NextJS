import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SubtaskList from "@/components/tasks/SubtaskList";
import { renderWithStore } from "./test-utils";

const task = {
  id: "task-sub",
  title: "Parent",
  status: "todo" as const,
  priority: "medium" as const,
  tagIds: [],
  subtasks: [
    { id: "s1", title: "Subtask A", completed: false },
    { id: "s2", title: "Subtask B", completed: true },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("SubtaskList", () => {
  it("renders subtask titles", () => {
    renderWithStore(
      <SubtaskList taskId={task.id} subtasks={task.subtasks} />,
      { preloadedState: { tasks: { items: [task] } } }
    );
    expect(screen.getByText("Subtask A")).toBeInTheDocument();
    expect(screen.getByText("Subtask B")).toBeInTheDocument();
  });

  it("shows completed count", () => {
    renderWithStore(
      <SubtaskList taskId={task.id} subtasks={task.subtasks} />,
      { preloadedState: { tasks: { items: [task] } } }
    );
    expect(screen.getByText("Subtasks (1/2)")).toBeInTheDocument();
  });

  it("toggles subtask completion on checkbox click", () => {
    const { store } = renderWithStore(
      <SubtaskList taskId={task.id} subtasks={task.subtasks} />,
      { preloadedState: { tasks: { items: [task] } } }
    );

    const checkboxes = screen.getAllByRole("checkbox");
    // First checkbox (Subtask A) is unchecked
    expect(checkboxes[0]).not.toBeChecked();

    fireEvent.click(checkboxes[0]);
    expect(store.getState().tasks.items[0].subtasks[0].completed).toBe(true);
  });

  it("deletes a subtask on delete button click", () => {
    const { store } = renderWithStore(
      <SubtaskList taskId={task.id} subtasks={task.subtasks} />,
      { preloadedState: { tasks: { items: [task] } } }
    );
    expect(store.getState().tasks.items[0].subtasks).toHaveLength(2);

    // Delete buttons are the X SVG buttons
    const deleteButtons = screen.getAllByRole("button").filter((b) => {
      const svg = b.querySelector("svg");
      return svg && b.textContent === "";
    });
    fireEvent.click(deleteButtons[0]);
    expect(store.getState().tasks.items[0].subtasks).toHaveLength(1);
  });

  it("adds a subtask via Add button", async () => {
    const { store } = renderWithStore(
      <SubtaskList taskId={task.id} subtasks={task.subtasks} />,
      { preloadedState: { tasks: { items: [task] } } }
    );

    const input = screen.getByPlaceholderText("Add subtask...");
    await userEvent.type(input, "New Subtask");
    fireEvent.click(screen.getByText("Add"));

    expect(store.getState().tasks.items[0].subtasks).toHaveLength(3);
    expect(store.getState().tasks.items[0].subtasks[2].title).toBe("New Subtask");
  });

  it("adds a subtask via Enter key", async () => {
    const { store } = renderWithStore(
      <SubtaskList taskId={task.id} subtasks={task.subtasks} />,
      { preloadedState: { tasks: { items: [task] } } }
    );

    const input = screen.getByPlaceholderText("Add subtask...");
    await userEvent.type(input, "Enter Subtask{Enter}");

    expect(store.getState().tasks.items[0].subtasks).toHaveLength(3);
    expect(store.getState().tasks.items[0].subtasks[2].title).toBe("Enter Subtask");
  });

  it("does not add subtask with empty title", async () => {
    const { store } = renderWithStore(
      <SubtaskList taskId={task.id} subtasks={task.subtasks} />,
      { preloadedState: { tasks: { items: [task] } } }
    );

    fireEvent.click(screen.getByText("Add"));
    expect(store.getState().tasks.items[0].subtasks).toHaveLength(2);
  });

  it("clears input after adding a subtask", async () => {
    renderWithStore(
      <SubtaskList taskId={task.id} subtasks={task.subtasks} />,
      { preloadedState: { tasks: { items: [task] } } }
    );

    const input = screen.getByPlaceholderText("Add subtask...");
    await userEvent.type(input, "Cleared");
    fireEvent.click(screen.getByText("Add"));

    expect(input).toHaveValue("");
  });
});
