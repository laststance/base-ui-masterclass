import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { NumberField } from "./initial";

function renderNumberField(props: {
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onValueChange?: (v: number) => void;
} = {}) {
  return render(
    <NumberField.Root {...props}>
      <NumberField.Decrement>-</NumberField.Decrement>
      <NumberField.Input aria-label="Quantity" />
      <NumberField.Increment>+</NumberField.Increment>
    </NumberField.Root>,
  );
}

describe("NumberField", () => {
  test("renders input with role='spinbutton'", () => {
    renderNumberField();
    const input = screen.getByRole("spinbutton");
    expect(input).toBeDefined();
  });

  test("displays the default value", () => {
    renderNumberField({ defaultValue: 5 });
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("aria-valuenow", "5");
  });

  test("sets aria-valuemin and aria-valuemax", () => {
    renderNumberField({ min: 0, max: 100 });
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("aria-valuemin", "0");
    expect(input).toHaveAttribute("aria-valuemax", "100");
  });

  test("clicking increment button increases value by step", () => {
    const onValueChange = vi.fn();
    renderNumberField({ defaultValue: 5, step: 1, onValueChange });
    fireEvent.click(screen.getByLabelText("Increment"));
    expect(onValueChange).toHaveBeenCalledWith(6);
  });

  test("clicking decrement button decreases value by step", () => {
    const onValueChange = vi.fn();
    renderNumberField({ defaultValue: 5, step: 1, onValueChange });
    fireEvent.click(screen.getByLabelText("Decrement"));
    expect(onValueChange).toHaveBeenCalledWith(4);
  });

  test("ArrowUp key increments value", () => {
    const onValueChange = vi.fn();
    renderNumberField({ defaultValue: 10, step: 2, onValueChange });
    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "ArrowUp" });
    expect(onValueChange).toHaveBeenCalledWith(12);
  });

  test("ArrowDown key decrements value", () => {
    const onValueChange = vi.fn();
    renderNumberField({ defaultValue: 10, step: 2, onValueChange });
    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "ArrowDown" });
    expect(onValueChange).toHaveBeenCalledWith(8);
  });

  test("Home key sets value to min", () => {
    const onValueChange = vi.fn();
    renderNumberField({ defaultValue: 50, min: 0, max: 100, onValueChange });
    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "Home" });
    expect(onValueChange).toHaveBeenCalledWith(0);
  });

  test("End key sets value to max", () => {
    const onValueChange = vi.fn();
    renderNumberField({ defaultValue: 50, min: 0, max: 100, onValueChange });
    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "End" });
    expect(onValueChange).toHaveBeenCalledWith(100);
  });

  test("value is clamped to max on increment", () => {
    const onValueChange = vi.fn();
    renderNumberField({ defaultValue: 99, min: 0, max: 100, step: 5, onValueChange });
    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "ArrowUp" });
    expect(onValueChange).toHaveBeenCalledWith(100);
  });

  test("value is clamped to min on decrement", () => {
    const onValueChange = vi.fn();
    renderNumberField({ defaultValue: 2, min: 0, max: 100, step: 5, onValueChange });
    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "ArrowDown" });
    expect(onValueChange).toHaveBeenCalledWith(0);
  });

  test("increment button is disabled when value >= max", () => {
    renderNumberField({ defaultValue: 100, min: 0, max: 100 });
    const btn = screen.getByLabelText("Increment");
    expect(btn).toHaveAttribute("disabled");
  });

  test("decrement button is disabled when value <= min", () => {
    renderNumberField({ defaultValue: 0, min: 0, max: 100 });
    const btn = screen.getByLabelText("Decrement");
    expect(btn).toHaveAttribute("disabled");
  });

  test("input is disabled when disabled prop is true", () => {
    renderNumberField({ disabled: true });
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("disabled");
  });
});
