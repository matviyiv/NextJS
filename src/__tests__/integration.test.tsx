import { screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "@/components/dashboard/Dashboard";
import { renderWithStore } from "./test-utils";

// Renders the full Dashboard component tree: AppShell > Sidebar + Header + Views + TaskForm + TaskDetail

/** Click the "Add Task" button in the header (not the empty state one). */
function clickHeaderAddTask(user: ReturnType<typeof userEvent.setup>) {
  const header = screen.getByRole("banner"); // <header> element
  const btn = within(header).getByRole("button", { name: /add task/i });
  return user.click(btn);
}

describe("App integration", () => {
  it("renders the dashboard with empty state", () => {
    renderWithStore(<Dashboard />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("0 tasks")).toBeInTheDocument();
    expect(screen.getByText("No tasks yet")).toBeInTheDocument();
    expect(screen.getByText("List View")).toBeInTheDocument();
  });

  it("full task lifecycle: create, view, edit, cycle status, delete", async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<Dashboard />);

    // --- 1. Create a task via header "Add Task" button ---
    await clickHeaderAddTask(user);
    expect(screen.getByText("New Task")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("What needs to be done?"), "Integration Test Task");
    await user.type(screen.getByPlaceholderText("Add more details..."), "Testing the full flow");
    await user.selectOptions(screen.getByDisplayValue("Medium"), "high");
    fireEvent.click(screen.getByText("Create Task"));

    // Task should now appear in the list
    expect(store.getState().tasks.items).toHaveLength(1);
    expect(screen.getByText("Integration Test Task")).toBeInTheDocument();
    expect(screen.getByText("1 task")).toBeInTheDocument();

    // Stats panel should update
    expect(screen.getByText("Total")).toBeInTheDocument();

    // --- 2. Cycle task status via the status badge (inside the task card) ---
    // The card's status badge is a <button>, the stats panel "To Do" is inside a <div>/<p>.
    const taskCard = screen.getByText("Integration Test Task").closest("[class*='cursor-pointer']")!;
    const statusBadge = within(taskCard as HTMLElement).getByRole("button");
    fireEvent.click(statusBadge);
    expect(store.getState().tasks.items[0].status).toBe("in_progress");

    // Badge now reads "In Progress" — get it from the card again
    const statusBadge2 = within(taskCard as HTMLElement).getByRole("button");
    fireEvent.click(statusBadge2);
    expect(store.getState().tasks.items[0].status).toBe("done");

    // Cycle back to todo
    const statusBadge3 = within(taskCard as HTMLElement).getByRole("button");
    fireEvent.click(statusBadge3);
    expect(store.getState().tasks.items[0].status).toBe("todo");

    // --- 3. Open task detail by clicking the card title ---
    fireEvent.click(screen.getByText("Integration Test Task"));
    // Description shows in both card and detail overlay
    expect(screen.getAllByText("Testing the full flow").length).toBeGreaterThanOrEqual(1);

    // --- 4. Edit from task detail ---
    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByText("Edit Task")).toBeInTheDocument();
    const titleInput = screen.getByDisplayValue("Integration Test Task");
    await user.clear(titleInput);
    await user.type(titleInput, "Renamed Task");
    fireEvent.click(screen.getByText("Save Changes"));

    expect(store.getState().tasks.items[0].title).toBe("Renamed Task");
    // "Renamed Task" appears in both card and detail overlay
    expect(screen.getAllByText("Renamed Task").length).toBeGreaterThanOrEqual(1);

    // --- 5. Delete the task from detail view ---
    // Detail is still showing after edit form closed, so Delete is already visible
    fireEvent.click(screen.getByText("Delete"));

    expect(store.getState().tasks.items).toHaveLength(0);
    expect(screen.getByText("0 tasks")).toBeInTheDocument();
    expect(screen.getByText("No tasks yet")).toBeInTheDocument();
  });

  it("search filters tasks in real-time", async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<Dashboard />);

    // Create two tasks
    await clickHeaderAddTask(user);
    await user.type(screen.getByPlaceholderText("What needs to be done?"), "Buy groceries");
    fireEvent.click(screen.getByText("Create Task"));

    await clickHeaderAddTask(user);
    await user.type(screen.getByPlaceholderText("What needs to be done?"), "Read a book");
    fireEvent.click(screen.getByText("Create Task"));

    expect(store.getState().tasks.items).toHaveLength(2);

    // Search for "book" — only one should be visible
    const searchInput = screen.getByPlaceholderText("Search tasks...");
    await user.type(searchInput, "book");

    expect(screen.getByText("Read a book")).toBeInTheDocument();
    expect(screen.queryByText("Buy groceries")).not.toBeInTheDocument();

    // Clear search — both visible again
    await user.clear(searchInput);
    expect(screen.getByText("Read a book")).toBeInTheDocument();
    expect(screen.getByText("Buy groceries")).toBeInTheDocument();
  });

  it("view switching renders correct view components", () => {
    renderWithStore(<Dashboard />);

    expect(screen.getByText("List View")).toBeInTheDocument();

    // Switch to Board
    fireEvent.click(screen.getByRole("button", { name: "Board" }));
    expect(screen.getByText("Board View")).toBeInTheDocument();

    // Switch to Groups
    fireEvent.click(screen.getByRole("button", { name: "Groups" }));
    expect(screen.getByText("Group View")).toBeInTheDocument();

    // Switch to Tags
    fireEvent.click(screen.getByRole("button", { name: "Tags" }));
    expect(screen.getByText("Tag View")).toBeInTheDocument();

    // Back to List
    fireEvent.click(screen.getByRole("button", { name: "List" }));
    expect(screen.getByText("List View")).toBeInTheDocument();
  });

  it("dark mode toggles the class on document element", () => {
    renderWithStore(<Dashboard />);

    expect(document.documentElement.classList.contains("dark")).toBe(false);

    fireEvent.click(screen.getByText("Dark Mode"));
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    fireEvent.click(screen.getByText("Light Mode"));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("sidebar group filter navigates to group view", async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<Dashboard />);

    // Create a task assigned to the first group
    const firstGroup = store.getState().groups.items[0]; // Personal
    await clickHeaderAddTask(user);
    await user.type(screen.getByPlaceholderText("What needs to be done?"), "Personal task");
    await user.selectOptions(screen.getByDisplayValue("No group"), firstGroup.id);
    fireEvent.click(screen.getByText("Create Task"));

    // Create an unassigned task
    await clickHeaderAddTask(user);
    await user.type(screen.getByPlaceholderText("What needs to be done?"), "No group task");
    fireEvent.click(screen.getByText("Create Task"));

    expect(store.getState().tasks.items).toHaveLength(2);

    // Click the "Personal" group in the sidebar (not the Badge on the card)
    const sidebar = screen.getByText("TaskFlow").closest("aside")!;
    fireEvent.click(within(sidebar as HTMLElement).getByText("Personal"));

    expect(store.getState().ui.viewMode).toBe("group");
    expect(store.getState().ui.filters.groupId).toBe(firstGroup.id);
  });

  it("empty state Add Task button opens form", async () => {
    const user = userEvent.setup();
    renderWithStore(<Dashboard />);

    // The empty state should show an "Add Task" button too
    const emptyState = screen.getByText("No tasks yet").closest("div.animate-fade-in")!;
    const emptyStateBtn = within(emptyState as HTMLElement).getByRole("button", { name: "Add Task" });
    await user.click(emptyStateBtn);
    expect(screen.getByText("New Task")).toBeInTheDocument();
  });

  it("board view shows task and status can be cycled", async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<Dashboard />);

    // Create a task
    await clickHeaderAddTask(user);
    await user.type(screen.getByPlaceholderText("What needs to be done?"), "Board task");
    fireEvent.click(screen.getByText("Create Task"));

    // Switch to board view
    fireEvent.click(screen.getByRole("button", { name: "Board" }));
    expect(screen.getByText("Board View")).toBeInTheDocument();
    expect(screen.getByText("Board task")).toBeInTheDocument();

    // Cycle status via the card's status badge
    const taskCard = screen.getByText("Board task").closest("[class*='cursor-pointer']")!;
    const badge = within(taskCard as HTMLElement).getByRole("button");
    fireEvent.click(badge);
    expect(store.getState().tasks.items[0].status).toBe("in_progress");
  });
});
