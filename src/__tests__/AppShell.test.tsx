import { screen, fireEvent } from "@testing-library/react";
import AppShell from "@/components/layout/AppShell";
import { renderWithStore } from "./test-utils";

describe("AppShell", () => {
  it("renders children", () => {
    renderWithStore(
      <AppShell>
        <div>Test Content</div>
      </AppShell>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders desktop sidebar with TaskFlow branding", () => {
    renderWithStore(
      <AppShell>
        <div>Content</div>
      </AppShell>
    );
    // Should find TaskFlow text from the desktop sidebar
    expect(screen.getByText("TaskFlow")).toBeInTheDocument();
  });

  it("does not show mobile sidebar overlay when sidebarOpen is false", () => {
    renderWithStore(
      <AppShell>
        <div>Content</div>
      </AppShell>
    );
    // Only 1 sidebar (desktop) should render, no backdrop
    const backdrops = document.querySelectorAll(".bg-black\\/30");
    expect(backdrops).toHaveLength(0);
  });

  it("shows mobile sidebar overlay when sidebarOpen is true", () => {
    renderWithStore(
      <AppShell>
        <div>Content</div>
      </AppShell>,
      {
        preloadedState: {
          ui: {
            viewMode: "list",
            sortField: "createdAt",
            sortDirection: "desc",
            filters: { status: [], priority: [], groupId: null, tagIds: [], search: "" },
            sidebarOpen: true,
            darkMode: false,
            editingTaskId: null,
          },
        },
      }
    );
    // Backdrop should exist
    const backdrop = document.querySelector(".bg-black\\/30");
    expect(backdrop).toBeInTheDocument();
  });

  it("closes mobile sidebar when backdrop is clicked", () => {
    const { store } = renderWithStore(
      <AppShell>
        <div>Content</div>
      </AppShell>,
      {
        preloadedState: {
          ui: {
            viewMode: "list",
            sortField: "createdAt",
            sortDirection: "desc",
            filters: { status: [], priority: [], groupId: null, tagIds: [], search: "" },
            sidebarOpen: true,
            darkMode: false,
            editingTaskId: null,
          },
        },
      }
    );

    const backdrop = document.querySelector(".bg-black\\/30")!;
    fireEvent.click(backdrop);
    expect(store.getState().ui.sidebarOpen).toBe(false);
  });

  it("closes mobile sidebar when a nav item is clicked (onNavigate)", () => {
    const { store } = renderWithStore(
      <AppShell>
        <div>Content</div>
      </AppShell>,
      {
        preloadedState: {
          ui: {
            viewMode: "list",
            sortField: "createdAt",
            sortDirection: "desc",
            filters: { status: [], priority: [], groupId: null, tagIds: [], search: "" },
            sidebarOpen: true,
            darkMode: false,
            editingTaskId: null,
          },
        },
      }
    );

    // There are 2 Sidebars rendered (desktop + mobile). "Board" buttons exist in both.
    const boardButtons = screen.getAllByText("Board");
    // Click the last one (mobile sidebar, rendered later in DOM)
    fireEvent.click(boardButtons[boardButtons.length - 1]);

    // Mobile sidebar should close
    expect(store.getState().ui.sidebarOpen).toBe(false);
    // View mode should change
    expect(store.getState().ui.viewMode).toBe("board");
  });

  it("toggles dark class on html element", () => {
    renderWithStore(
      <AppShell>
        <div>Content</div>
      </AppShell>,
      {
        preloadedState: {
          ui: {
            viewMode: "list",
            sortField: "createdAt",
            sortDirection: "desc",
            filters: { status: [], priority: [], groupId: null, tagIds: [], search: "" },
            sidebarOpen: false,
            darkMode: true,
            editingTaskId: null,
          },
        },
      }
    );

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
