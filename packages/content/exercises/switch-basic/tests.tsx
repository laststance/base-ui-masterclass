import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Switch } from "./initial";

describe("Switch", () => {
  test("renders with role='switch'", () => {
    render(<Switch>Toggle</Switch>);
    const sw = screen.getByRole("switch");
    expect(sw).toBeDefined();
  });

  test("defaults to unchecked (aria-checked='false')", () => {
    render(<Switch>Toggle</Switch>);
    const sw = screen.getByRole("switch");
    expect(sw).toHaveAttribute("aria-checked", "false");
  });

  test("respects defaultChecked prop", () => {
    render(<Switch defaultChecked>Toggle</Switch>);
    const sw = screen.getByRole("switch");
    expect(sw).toHaveAttribute("aria-checked", "true");
  });

  test("toggles on click", () => {
    render(<Switch>Toggle</Switch>);
    const sw = screen.getByRole("switch");

    expect(sw).toHaveAttribute("aria-checked", "false");

    fireEvent.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "true");

    fireEvent.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "false");
  });

  test("toggles on Space key", () => {
    render(<Switch>Toggle</Switch>);
    const sw = screen.getByRole("switch");

    fireEvent.keyDown(sw, { key: " " });
    expect(sw).toHaveAttribute("aria-checked", "true");
  });

  test("toggles on Enter key", () => {
    render(<Switch>Toggle</Switch>);
    const sw = screen.getByRole("switch");

    fireEvent.keyDown(sw, { key: "Enter" });
    expect(sw).toHaveAttribute("aria-checked", "true");
  });

  test("does not toggle when disabled", () => {
    render(<Switch disabled>Toggle</Switch>);
    const sw = screen.getByRole("switch");

    fireEvent.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "false");
  });

  test("adds data-checked when checked", () => {
    render(<Switch defaultChecked>Toggle</Switch>);
    const sw = screen.getByRole("switch");
    expect(sw).toHaveAttribute("data-checked");
  });

  test("adds data-unchecked when not checked", () => {
    render(<Switch>Toggle</Switch>);
    const sw = screen.getByRole("switch");
    expect(sw).toHaveAttribute("data-unchecked");
  });

  test("adds data-disabled when disabled", () => {
    render(<Switch disabled>Toggle</Switch>);
    const sw = screen.getByRole("switch");
    expect(sw).toHaveAttribute("data-disabled");
  });

  test("calls onCheckedChange callback", () => {
    const onChange = jest.fn();
    render(<Switch onCheckedChange={onChange}>Toggle</Switch>);
    const sw = screen.getByRole("switch");

    fireEvent.click(sw);
    expect(onChange).toHaveBeenCalledWith(true);

    fireEvent.click(sw);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  test("works in controlled mode", () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <Switch checked={false} onCheckedChange={onChange}>Toggle</Switch>
    );
    const sw = screen.getByRole("switch");

    expect(sw).toHaveAttribute("aria-checked", "false");

    fireEvent.click(sw);
    expect(onChange).toHaveBeenCalledWith(true);

    // Value should not change without rerender (controlled)
    expect(sw).toHaveAttribute("aria-checked", "false");

    // Parent updates the controlled value
    rerender(<Switch checked={true} onCheckedChange={onChange}>Toggle</Switch>);
    expect(sw).toHaveAttribute("aria-checked", "true");
  });
});
