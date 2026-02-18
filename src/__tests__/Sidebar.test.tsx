import { screen, fireEvent } from "@testing-library/react";
import Sidebar from "@/components/layout/Sidebar";
import { renderWithStore } from "./test-utils";

describe("Sidebar", () => {
  it("renders logo text", () => {
    renderWithStore(<Sidebar />);
    expect(screen.getByText("TaskFlow")).toBeInTheDocument();
  });

  it("renders all four view mode buttons", () => {
    renderWithStore(<Sidebar />);
    expect(screen.getByRole("button", { name: "List" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Board" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Groups" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tags" })).toBeInTheDocument();
  });

  it("renders default groups", () => {
    renderWithStore(<Sidebar />);
    expect(screen.getByText("Personal")).toBeInTheDocument();
    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("Health")).toBeInTheDocument();
  });

  it("renders default tags", () => {
    renderWithStore(<Sidebar />);
    expect(screen.getByText("Urgent")).toBeInTheDocument();
    expect(screen.getByText("Feature")).toBeInTheDocument();
    expect(screen.getByText("Bug")).toBeInTheDocument();
  });

  it("switches view mode when a view button is clicked", () => {
    const { store } = renderWithStore(<Sidebar />);
    expect(store.getState().ui.viewMode).toBe("list");

    fireEvent.click(screen.getByText("Board"));
    expect(store.getState().ui.viewMode).toBe("board");

    fireEvent.click(screen.getByRole("button", { name: "Groups" }));
    expect(store.getState().ui.viewMode).toBe("group");

    fireEvent.click(screen.getByRole("button", { name: "Tags" }));
    expect(store.getState().ui.viewMode).toBe("tag");

    fireEvent.click(screen.getByText("List"));
    expect(store.getState().ui.viewMode).toBe("list");
  });

  it("clears filters when switching views", () => {
    const { store } = renderWithStore(<Sidebar />, {
      preloadedState: {
        ui: {
          viewMode: "list",
          sortField: "createdAt",
          sortDirection: "desc",
          filters: { status: [], priority: [], groupId: null, tagIds: [], search: "test" },
          sidebarOpen: false,
          darkMode: false,
          editingTaskId: null,
        },
      },
    });
    expect(store.getState().ui.filters.search).toBe("test");

    fireEvent.click(screen.getByText("Board"));
    expect(store.getState().ui.filters.search).toBe("");
  });

  it("clicking a group sets groupId filter and group view", () => {
    const { store } = renderWithStore(<Sidebar />);
    const groupId = store.getState().groups.items[0].id;

    fireEvent.click(screen.getByText("Personal"));
    expect(store.getState().ui.viewMode).toBe("group");
    expect(store.getState().ui.filters.groupId).toBe(groupId);
  });

  it("clicking a tag sets tagIds filter and tag view", () => {
    const { store } = renderWithStore(<Sidebar />);
    const tagId = store.getState().tags.items[0].id;

    fireEvent.click(screen.getByText("Urgent"));
    expect(store.getState().ui.viewMode).toBe("tag");
    expect(store.getState().ui.filters.tagIds).toEqual([tagId]);
  });

  it("toggles dark mode", () => {
    const { store } = renderWithStore(<Sidebar />);
    expect(store.getState().ui.darkMode).toBe(false);

    fireEvent.click(screen.getByText("Dark Mode"));
    expect(store.getState().ui.darkMode).toBe(true);

    fireEvent.click(screen.getByText("Light Mode"));
    expect(store.getState().ui.darkMode).toBe(false);
  });

  it("calls onNavigate callback on every navigation action", () => {
    const onNavigate = jest.fn();
    renderWithStore(<Sidebar onNavigate={onNavigate} />);

    fireEvent.click(screen.getByText("Board"));
    expect(onNavigate).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("Personal"));
    expect(onNavigate).toHaveBeenCalledTimes(2);

    fireEvent.click(screen.getByText("Urgent"));
    expect(onNavigate).toHaveBeenCalledTimes(3);
  });
});
