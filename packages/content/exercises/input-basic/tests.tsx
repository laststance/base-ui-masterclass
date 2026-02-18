import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "./initial";

describe("Input", () => {
  test("renders an input element by default", () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeDefined();
    expect(input.tagName).toBe("INPUT");
  });

  test("forwards native input props", () => {
    render(<Input type="email" name="email" placeholder="you@example.com" />);
    const input = screen.getByPlaceholderText("you@example.com");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("name", "email");
  });

  test("supports disabled prop and adds data-disabled", () => {
    render(<Input disabled placeholder="Disabled" />);
    const input = screen.getByPlaceholderText("Disabled");
    expect(input).toHaveAttribute("disabled");
    expect(input).toHaveAttribute("data-disabled");
  });

  test("does not add data-disabled when not disabled", () => {
    render(<Input placeholder="Enabled" />);
    const input = screen.getByPlaceholderText("Enabled");
    expect(input).not.toHaveAttribute("data-disabled");
  });

  test("adds data-invalid when aria-invalid is set", () => {
    render(<Input aria-invalid={true} placeholder="Invalid" />);
    const input = screen.getByPlaceholderText("Invalid");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("data-invalid");
  });

  test("does not add data-invalid when aria-invalid is not set", () => {
    render(<Input placeholder="Valid" />);
    const input = screen.getByPlaceholderText("Valid");
    expect(input).not.toHaveAttribute("data-invalid");
  });

  test("tracks focus state with data-focused", () => {
    render(<Input placeholder="Focus me" />);
    const input = screen.getByPlaceholderText("Focus me");

    expect(input).not.toHaveAttribute("data-focused");

    fireEvent.focus(input);
    expect(input).toHaveAttribute("data-focused");

    fireEvent.blur(input);
    expect(input).not.toHaveAttribute("data-focused");
  });

  test("calls user-provided onFocus and onBlur handlers", () => {
    let focusCount = 0;
    let blurCount = 0;

    render(
      <Input
        placeholder="Events"
        onFocus={() => { focusCount++; }}
        onBlur={() => { blurCount++; }}
      />
    );
    const input = screen.getByPlaceholderText("Events");

    fireEvent.focus(input);
    expect(focusCount).toBe(1);

    fireEvent.blur(input);
    expect(blurCount).toBe(1);
  });

  test("supports render prop for custom elements", () => {
    render(
      <Input render={<textarea />} placeholder="Custom" />
    );
    const textarea = screen.getByPlaceholderText("Custom");
    expect(textarea.tagName).toBe("TEXTAREA");
  });
});
