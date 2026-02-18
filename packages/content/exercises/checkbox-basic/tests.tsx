import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Checkbox } from "./initial";

describe("Checkbox", () => {
  test("renders with role='checkbox'", () => {
    render(<Checkbox>Check me</Checkbox>);
    const cb = screen.getByRole("checkbox");
    expect(cb).toBeDefined();
  });

  test("defaults to unchecked (aria-checked='false')", () => {
    render(<Checkbox>Check me</Checkbox>);
    const cb = screen.getByRole("checkbox");
    expect(cb).toHaveAttribute("aria-checked", "false");
  });

  test("respects defaultChecked={true}", () => {
    render(<Checkbox defaultChecked>Check me</Checkbox>);
    const cb = screen.getByRole("checkbox");
    expect(cb).toHaveAttribute("aria-checked", "true");
  });

  test("toggles between checked and unchecked on click", () => {
    render(<Checkbox>Check me</Checkbox>);
    const cb = screen.getByRole("checkbox");

    fireEvent.click(cb);
    expect(cb).toHaveAttribute("aria-checked", "true");

    fireEvent.click(cb);
    expect(cb).toHaveAttribute("aria-checked", "false");
  });

  test("does not toggle when disabled", () => {
    render(<Checkbox disabled>Check me</Checkbox>);
    const cb = screen.getByRole("checkbox");

    fireEvent.click(cb);
    expect(cb).toHaveAttribute("aria-checked", "false");
  });

  test("supports indeterminate state with aria-checked='mixed'", () => {
    render(<Checkbox checked="indeterminate">Select all</Checkbox>);
    const cb = screen.getByRole("checkbox");
    expect(cb).toHaveAttribute("aria-checked", "mixed");
  });

  test("indeterminate transitions to checked on click", () => {
    const onChange = vi.fn();
    render(
      <Checkbox
        defaultChecked={"indeterminate" as any}
        onCheckedChange={onChange}
      >
        Select all
      </Checkbox>
    );
    const cb = screen.getByRole("checkbox");

    fireEvent.click(cb);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  test("adds data-checked when checked", () => {
    render(<Checkbox defaultChecked>Check me</Checkbox>);
    const cb = screen.getByRole("checkbox");
    expect(cb).toHaveAttribute("data-checked");
    expect(cb).not.toHaveAttribute("data-unchecked");
  });

  test("adds data-unchecked when unchecked", () => {
    render(<Checkbox>Check me</Checkbox>);
    const cb = screen.getByRole("checkbox");
    expect(cb).toHaveAttribute("data-unchecked");
    expect(cb).not.toHaveAttribute("data-checked");
  });

  test("adds data-indeterminate when indeterminate", () => {
    render(<Checkbox checked="indeterminate">Select all</Checkbox>);
    const cb = screen.getByRole("checkbox");
    expect(cb).toHaveAttribute("data-indeterminate");
    expect(cb).not.toHaveAttribute("data-checked");
    expect(cb).not.toHaveAttribute("data-unchecked");
  });

  test("adds data-disabled when disabled", () => {
    render(<Checkbox disabled>Check me</Checkbox>);
    const cb = screen.getByRole("checkbox");
    expect(cb).toHaveAttribute("data-disabled");
  });

  test("calls onCheckedChange callback", () => {
    const onChange = vi.fn();
    render(<Checkbox onCheckedChange={onChange}>Check me</Checkbox>);
    const cb = screen.getByRole("checkbox");

    fireEvent.click(cb);
    expect(onChange).toHaveBeenCalledWith(true);

    fireEvent.click(cb);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  test("works in controlled mode", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Checkbox checked={false} onCheckedChange={onChange}>Check me</Checkbox>
    );
    const cb = screen.getByRole("checkbox");

    expect(cb).toHaveAttribute("aria-checked", "false");

    fireEvent.click(cb);
    expect(onChange).toHaveBeenCalledWith(true);

    // Value should not change without rerender (controlled)
    expect(cb).toHaveAttribute("aria-checked", "false");

    // Parent updates the controlled value
    rerender(<Checkbox checked={true} onCheckedChange={onChange}>Check me</Checkbox>);
    expect(cb).toHaveAttribute("aria-checked", "true");
  });
});
