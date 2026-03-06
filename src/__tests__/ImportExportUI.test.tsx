import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "@/components/dashboard/Dashboard";
import { renderWithStore } from "./test-utils";
import { Task } from "@/types";

// Mock URL.createObjectURL / revokeObjectURL for download tests
const mockCreateObjectURL = jest.fn(() => "blob:mock-url");
const mockRevokeObjectURL = jest.fn();
Object.defineProperty(globalThis, "URL", {
  value: { createObjectURL: mockCreateObjectURL, revokeObjectURL: mockRevokeObjectURL },
  writable: true,
});

const sampleExport = {
  version: 1,
  exportedAt: "2025-06-01T00:00:00.000Z",
  tasks: [
    {
      id: "exp-1",
      title: "Exported Task",
      status: "todo",
      priority: "medium",
      tagIds: [],
      subtasks: [],
      createdAt: "2025-06-01T00:00:00.000Z",
      updatedAt: "2025-06-01T00:00:00.000Z",
    },
  ],
};

describe("Import/Export UI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Export button in header", () => {
    renderWithStore(<Dashboard />);
    expect(screen.getByRole("button", { name: /export/i })).toBeInTheDocument();
  });

  it("renders Import button in header", () => {
    renderWithStore(<Dashboard />);
    expect(screen.getByRole("button", { name: /import/i })).toBeInTheDocument();
  });

  it("export triggers a file download", async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<Dashboard />);

    // Add a task first so there's something to export
    const { addTask } = await import("@/store/slices/tasksSlice");
    act(() => {
      store.dispatch(addTask({ title: "Export me", status: "todo", priority: "low", tagIds: [] }));
    });

    // Mock the click on a dynamically created <a> element
    const linkClick = jest.fn();
    jest.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "a") {
        const el = document.createElementNS("http://www.w3.org/1999/xhtml", "a") as HTMLAnchorElement;
        el.click = linkClick;
        return el;
      }
      return document.createElementNS("http://www.w3.org/1999/xhtml", tag) as HTMLElement;
    });

    await user.click(screen.getByRole("button", { name: /export/i }));

    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(linkClick).toHaveBeenCalled();

    jest.restoreAllMocks();
  });

  it("import button accepts a file and imports tasks", async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<Dashboard />);

    // The import button should have a hidden file input
    const fileInput = document.querySelector('input[type="file"][accept=".json"]') as HTMLInputElement;
    expect(fileInput).not.toBeNull();

    // Simulate file selection
    const jsonContent = JSON.stringify(sampleExport);
    const file = new File([jsonContent], "tasks.json", { type: "application/json" });

    await user.upload(fileInput, file);

    // Tasks should be imported into the store
    await waitFor(() => {
      expect(store.getState().tasks.items.length).toBeGreaterThanOrEqual(1);
    });
    const imported = store.getState().tasks.items.find((t: Task) => t.title === "Exported Task");
    expect(imported).toBeDefined();
  });

  it("import shows error for invalid JSON file", async () => {
    const user = userEvent.setup();
    renderWithStore(<Dashboard />);

    const fileInput = document.querySelector('input[type="file"][accept=".json"]') as HTMLInputElement;
    const file = new File(["not valid json{{{"], "bad.json", { type: "application/json" });

    // Mock window.alert for error display
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    await user.upload(fileInput, file);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(expect.stringMatching(/invalid|error|fail/i));
    });

    alertMock.mockRestore();
  });
});
