import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ToastProvider, toast, dismissToast } from "./initial";

function renderWithProvider(ui?: React.ReactNode) {
  return render(
    <ToastProvider>
      {ui ?? <div>App Content</div>}
    </ToastProvider>,
  );
}

describe("Toast", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("renders provider with children", () => {
    renderWithProvider(<p>Hello</p>);
    expect(screen.getByText("Hello")).toBeDefined();
  });

  test("toast container has aria-live='polite'", () => {
    renderWithProvider();
    const container = screen.getByTestId("toast-container");
    expect(container).toHaveAttribute("aria-live", "polite");
  });

  test("toast() adds a toast to the UI", () => {
    renderWithProvider();
    act(() => {
      toast("File saved", "success");
    });
    expect(screen.getByText("File saved")).toBeDefined();
  });

  test("info toast has role='status'", () => {
    renderWithProvider();
    act(() => {
      toast("Info message", "info");
    });
    const toastEl = screen.getByRole("status");
    expect(toastEl).toBeDefined();
  });

  test("error toast has role='alert'", () => {
    renderWithProvider();
    act(() => {
      toast("Error occurred", "error");
    });
    const toastEl = screen.getByRole("alert");
    expect(toastEl).toBeDefined();
  });

  test("success toast has role='status'", () => {
    renderWithProvider();
    act(() => {
      toast("Saved", "success");
    });
    expect(screen.getByRole("status")).toBeDefined();
  });

  test("dismissToast removes the toast", () => {
    renderWithProvider();
    let id: string;
    act(() => {
      id = toast("Temporary", "info");
    });
    expect(screen.getByText("Temporary")).toBeDefined();
    act(() => {
      dismissToast(id!);
    });
    expect(screen.queryByText("Temporary")).toBeNull();
  });

  test("dismiss button has accessible label", () => {
    renderWithProvider();
    act(() => {
      toast("With close", "info");
    });
    const btn = screen.getByLabelText("Dismiss notification");
    expect(btn).toBeDefined();
  });

  test("clicking dismiss button removes the toast", () => {
    renderWithProvider();
    act(() => {
      toast("Click to close", "info");
    });
    const btn = screen.getByLabelText("Dismiss notification");
    fireEvent.click(btn);
    expect(screen.queryByText("Click to close")).toBeNull();
  });

  test("toast auto-dismisses after duration", () => {
    renderWithProvider();
    act(() => {
      toast("Auto dismiss", "info", 3000);
    });
    expect(screen.getByText("Auto dismiss")).toBeDefined();
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.queryByText("Auto dismiss")).toBeNull();
  });

  test("multiple toasts can be shown simultaneously", () => {
    renderWithProvider();
    act(() => {
      toast("First", "info");
      toast("Second", "success");
      toast("Third", "warning");
    });
    expect(screen.getByText("First")).toBeDefined();
    expect(screen.getByText("Second")).toBeDefined();
    expect(screen.getByText("Third")).toBeDefined();
  });

  test("toast has data-variant attribute", () => {
    renderWithProvider();
    act(() => {
      toast("Warn message", "warning");
    });
    const toastEl = screen.getByRole("status");
    expect(toastEl).toHaveAttribute("data-variant", "warning");
  });

  test("hover pauses auto-dismiss timer", () => {
    renderWithProvider();
    act(() => {
      toast("Hover me", "info", 3000);
    });
    const toastEl = screen.getByRole("status");

    // Advance 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText("Hover me")).toBeDefined();

    // Hover to pause
    fireEvent.mouseEnter(toastEl);
    act(() => {
      jest.advanceTimersByTime(5000); // Way past original duration
    });
    expect(screen.getByText("Hover me")).toBeDefined(); // Still visible

    // Unhover to resume
    fireEvent.mouseLeave(toastEl);
    act(() => {
      jest.advanceTimersByTime(2000); // Remaining ~2 seconds
    });
    expect(screen.queryByText("Hover me")).toBeNull();
  });
});
