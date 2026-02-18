import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Popover } from "./initial";

function renderPopover(defaultOpen = false) {
  return render(
    <Popover.Root defaultOpen={defaultOpen}>
      <Popover.Trigger>Open</Popover.Trigger>
      <Popover.Content aria-label="Settings">
        <input placeholder="Search" />
        <button>Action</button>
        <Popover.Close>Close</Popover.Close>
      </Popover.Content>
    </Popover.Root>,
  );
}

describe("Popover", () => {
  test("popover is hidden by default", () => {
    renderPopover();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("clicking trigger opens the popover", () => {
    renderPopover();
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeDefined();
  });

  test("clicking trigger again closes the popover", () => {
    renderPopover();
    const trigger = screen.getByRole("button", { name: "Open" });
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog")).toBeDefined();

    fireEvent.click(trigger);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("trigger has aria-expanded='false' when closed", () => {
    renderPopover();
    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("trigger has aria-expanded='true' when open", () => {
    renderPopover();
    const trigger = screen.getByRole("button", { name: "Open" });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  test("trigger has aria-controls pointing to popover id when open", () => {
    renderPopover();
    const trigger = screen.getByRole("button", { name: "Open" });
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog");
    expect(trigger.getAttribute("aria-controls")).toBe(dialog.id);
  });

  test("trigger has aria-haspopup='dialog'", () => {
    renderPopover();
    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
  });

  test("popover has role='dialog'", () => {
    renderPopover();
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeDefined();
  });

  test("focus moves to first focusable element when popover opens", () => {
    renderPopover();
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    const input = screen.getByPlaceholderText("Search");
    expect(document.activeElement).toBe(input);
  });

  test("Escape key closes the popover", () => {
    renderPopover();
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeDefined();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("Escape key returns focus to trigger", () => {
    renderPopover();
    const trigger = screen.getByRole("button", { name: "Open" });
    fireEvent.click(trigger);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.activeElement).toBe(trigger);
  });

  test("clicking outside closes the popover", () => {
    renderPopover();
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeDefined();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("clicking inside the popover does not close it", () => {
    renderPopover();
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    const action = screen.getByRole("button", { name: "Action" });
    fireEvent.mouseDown(action);
    expect(screen.getByRole("dialog")).toBeDefined();
  });

  test("Close button closes the popover", () => {
    renderPopover();
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("popover renders through a portal into document.body", () => {
    renderPopover();
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    const dialog = screen.getByRole("dialog");
    expect(dialog.closest("body")).toBe(document.body);
  });
});
