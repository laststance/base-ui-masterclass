import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Dialog } from "./initial";

function renderDialog(defaultOpen = false) {
  return render(
    <Dialog.Root defaultOpen={defaultOpen}>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="content">
          <Dialog.Title>Test Dialog</Dialog.Title>
          <Dialog.Description>This is a test dialog.</Dialog.Description>
          <input placeholder="Name" />
          <button>Submit</button>
          <Dialog.Close>Cancel</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>,
  );
}

describe("Dialog", () => {
  test("dialog is hidden by default", () => {
    renderDialog();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("clicking trigger opens the dialog", () => {
    renderDialog();
    fireEvent.click(screen.getByRole("button", { name: "Open Dialog" }));
    expect(screen.getByRole("dialog")).toBeDefined();
  });

  test("dialog has role='dialog'", () => {
    renderDialog(true);
    expect(screen.getByRole("dialog")).toBeDefined();
  });

  test("dialog has aria-modal='true'", () => {
    renderDialog(true);
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });

  test("dialog has aria-labelledby pointing to title", () => {
    renderDialog(true);
    const dialog = screen.getByRole("dialog");
    const titleId = dialog.getAttribute("aria-labelledby");
    expect(titleId).toBeTruthy();

    const title = document.getElementById(titleId!);
    expect(title).toBeDefined();
    expect(title?.textContent).toBe("Test Dialog");
  });

  test("dialog has aria-describedby pointing to description", () => {
    renderDialog(true);
    const dialog = screen.getByRole("dialog");
    const descId = dialog.getAttribute("aria-describedby");
    expect(descId).toBeTruthy();

    const desc = document.getElementById(descId!);
    expect(desc).toBeDefined();
    expect(desc?.textContent).toBe("This is a test dialog.");
  });

  test("focus moves to first focusable element on open", () => {
    renderDialog();
    fireEvent.click(screen.getByRole("button", { name: "Open Dialog" }));

    const input = screen.getByPlaceholderText("Name");
    expect(document.activeElement).toBe(input);
  });

  test("Escape key closes the dialog", () => {
    renderDialog();
    fireEvent.click(screen.getByRole("button", { name: "Open Dialog" }));
    expect(screen.getByRole("dialog")).toBeDefined();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("focus returns to trigger when dialog closes via Escape", () => {
    renderDialog();
    const trigger = screen.getByRole("button", { name: "Open Dialog" });
    fireEvent.click(trigger);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.activeElement).toBe(trigger);
  });

  test("clicking overlay closes the dialog", () => {
    renderDialog();
    fireEvent.click(screen.getByRole("button", { name: "Open Dialog" }));
    expect(screen.getByRole("dialog")).toBeDefined();

    const overlay = document.querySelector("[data-dialog-overlay]")!;
    fireEvent.click(overlay);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("Close button closes the dialog", () => {
    renderDialog();
    fireEvent.click(screen.getByRole("button", { name: "Open Dialog" }));
    expect(screen.getByRole("dialog")).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("dialog renders through a portal", () => {
    renderDialog(true);
    const dialog = screen.getByRole("dialog");
    const portal = dialog.closest("[data-portal]");
    expect(portal).toBeDefined();
    expect(portal?.parentElement).toBe(document.body);
  });

  test("focus moves to data-autofocus element if present", () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Title>Autofocus Test</Dialog.Title>
            <Dialog.Description>Testing autofocus.</Dialog.Description>
            <input placeholder="First" />
            <input placeholder="Second" data-autofocus />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>,
    );

    const second = screen.getByPlaceholderText("Second");
    expect(document.activeElement).toBe(second);
  });

  test("calls onOpenChange when dialog opens and closes", () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog.Root onOpenChange={onOpenChange}>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Title>Test</Dialog.Title>
            <Dialog.Description>Desc</Dialog.Description>
            <Dialog.Close>Close</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
