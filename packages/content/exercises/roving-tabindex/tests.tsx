import { render, screen, fireEvent } from "@testing-library/react";
import { ToolbarDemo } from "./initial";

const items = ["Bold", "Italic", "Underline"];

describe("useRovingTabIndex", () => {
  test("first item has tabIndex=0, others have tabIndex=-1", () => {
    render(<ToolbarDemo items={items} />);
    const buttons = screen.getAllByRole("button");

    expect(buttons[0]).toHaveAttribute("tabindex", "0");
    expect(buttons[1]).toHaveAttribute("tabindex", "-1");
    expect(buttons[2]).toHaveAttribute("tabindex", "-1");
  });

  test("ArrowRight moves focus to next item", () => {
    render(<ToolbarDemo items={items} />);
    const buttons = screen.getAllByRole("button");

    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: "ArrowRight" });

    expect(document.activeElement).toBe(buttons[1]);
  });

  test("ArrowLeft moves focus to previous item", () => {
    render(<ToolbarDemo items={items} />);
    const buttons = screen.getAllByRole("button");

    buttons[0].focus();
    // Move to second item first
    fireEvent.keyDown(buttons[0], { key: "ArrowRight" });
    // Now move back
    fireEvent.keyDown(buttons[1], { key: "ArrowLeft" });

    expect(document.activeElement).toBe(buttons[0]);
  });

  test("wraps from last item to first on ArrowRight", () => {
    render(<ToolbarDemo items={items} />);
    const buttons = screen.getAllByRole("button");

    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: "ArrowRight" });
    fireEvent.keyDown(buttons[1], { key: "ArrowRight" });
    fireEvent.keyDown(buttons[2], { key: "ArrowRight" });

    expect(document.activeElement).toBe(buttons[0]);
  });

  test("wraps from first item to last on ArrowLeft", () => {
    render(<ToolbarDemo items={items} />);
    const buttons = screen.getAllByRole("button");

    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: "ArrowLeft" });

    expect(document.activeElement).toBe(buttons[2]);
  });

  test("Home key moves focus to first item", () => {
    render(<ToolbarDemo items={items} />);
    const buttons = screen.getAllByRole("button");

    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: "ArrowRight" });
    fireEvent.keyDown(buttons[1], { key: "ArrowRight" });
    // Now on the last item
    fireEvent.keyDown(buttons[2], { key: "Home" });

    expect(document.activeElement).toBe(buttons[0]);
  });

  test("End key moves focus to last item", () => {
    render(<ToolbarDemo items={items} />);
    const buttons = screen.getAllByRole("button");

    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: "End" });

    expect(document.activeElement).toBe(buttons[2]);
  });

  test("active item updates tabIndex after navigation", () => {
    render(<ToolbarDemo items={items} />);
    const buttons = screen.getAllByRole("button");

    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: "ArrowRight" });

    // After moving right, second button should be active
    expect(buttons[0]).toHaveAttribute("tabindex", "-1");
    expect(buttons[1]).toHaveAttribute("tabindex", "0");
    expect(buttons[2]).toHaveAttribute("tabindex", "-1");
  });

  test("clicking an item makes it active", () => {
    render(<ToolbarDemo items={items} />);
    const buttons = screen.getAllByRole("button");

    // Focus (click) the third button
    fireEvent.focus(buttons[2]);

    expect(buttons[0]).toHaveAttribute("tabindex", "-1");
    expect(buttons[1]).toHaveAttribute("tabindex", "-1");
    expect(buttons[2]).toHaveAttribute("tabindex", "0");
  });
});
