import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "@/components/layout/Header";
import { renderWithStore } from "./test-utils";

describe("Header", () => {
  it("renders task count", () => {
    renderWithStore(<Header onAddTask={jest.fn()} />);
    expect(screen.getByText("0 tasks")).toBeInTheDocument();
  });

  it("renders singular task count", () => {
    renderWithStore(<Header onAddTask={jest.fn()} />, {
      preloadedState: {
        tasks: {
          items: [
            {
              id: "1",
              title: "Test",
              status: "todo",
              priority: "low",
              tagIds: [],
              subtasks: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        },
      },
    });
    expect(screen.getByText("1 task")).toBeInTheDocument();
  });

  it("calls onAddTask when Add Task button is clicked", async () => {
    const onAddTask = jest.fn();
    renderWithStore(<Header onAddTask={onAddTask} />);
    const addBtn = screen.getByRole("button", { name: /add task/i });
    await userEvent.click(addBtn);
    expect(onAddTask).toHaveBeenCalledTimes(1);
  });

  it("dispatches toggleSidebar when hamburger is clicked", () => {
    const { store } = renderWithStore(<Header onAddTask={jest.fn()} />);
    expect(store.getState().ui.sidebarOpen).toBe(false);

    // Hamburger is the first button (no accessible name, so grab all buttons)
    const buttons = screen.getAllByRole("button");
    // Hamburger is the one that's NOT "Add Task"
    const hamburger = buttons.find(
      (b) => !b.textContent?.includes("Add Task")
    )!;
    fireEvent.click(hamburger);
    expect(store.getState().ui.sidebarOpen).toBe(true);
  });

  it("dispatches search filter on input change", async () => {
    const { store } = renderWithStore(<Header onAddTask={jest.fn()} />);
    const input = screen.getByPlaceholderText("Search tasks...");
    await userEvent.type(input, "hello");
    expect(store.getState().ui.filters.search).toBe("hello");
  });
});
