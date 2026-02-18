import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Slider } from "./initial";

function renderSlider(props: {
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  onValueChange?: (v: number) => void;
} = {}) {
  const { min = 0, max = 100, ...rest } = props;
  return render(
    <Slider.Root min={min} max={max} {...rest}>
      <Slider.Track>
        <Slider.Range />
      </Slider.Track>
      <Slider.Thumb aria-label="Volume" />
    </Slider.Root>,
  );
}

describe("Slider", () => {
  test("renders thumb with role='slider'", () => {
    renderSlider();
    const thumb = screen.getByRole("slider");
    expect(thumb).toBeDefined();
  });

  test("thumb has correct aria-valuenow", () => {
    renderSlider({ defaultValue: 50 });
    const thumb = screen.getByRole("slider");
    expect(thumb).toHaveAttribute("aria-valuenow", "50");
  });

  test("thumb has aria-valuemin and aria-valuemax", () => {
    renderSlider({ min: 10, max: 200 });
    const thumb = screen.getByRole("slider");
    expect(thumb).toHaveAttribute("aria-valuemin", "10");
    expect(thumb).toHaveAttribute("aria-valuemax", "200");
  });

  test("thumb has aria-orientation", () => {
    renderSlider({ orientation: "horizontal" });
    const thumb = screen.getByRole("slider");
    expect(thumb).toHaveAttribute("aria-orientation", "horizontal");
  });

  test("ArrowRight increments value by step", () => {
    const onValueChange = vi.fn();
    renderSlider({ defaultValue: 50, step: 5, onValueChange });
    const thumb = screen.getByRole("slider");
    fireEvent.keyDown(thumb, { key: "ArrowRight" });
    expect(onValueChange).toHaveBeenCalledWith(55);
  });

  test("ArrowLeft decrements value by step", () => {
    const onValueChange = vi.fn();
    renderSlider({ defaultValue: 50, step: 5, onValueChange });
    const thumb = screen.getByRole("slider");
    fireEvent.keyDown(thumb, { key: "ArrowLeft" });
    expect(onValueChange).toHaveBeenCalledWith(45);
  });

  test("ArrowUp increments value by step", () => {
    const onValueChange = vi.fn();
    renderSlider({ defaultValue: 30, step: 10, onValueChange });
    const thumb = screen.getByRole("slider");
    fireEvent.keyDown(thumb, { key: "ArrowUp" });
    expect(onValueChange).toHaveBeenCalledWith(40);
  });

  test("ArrowDown decrements value by step", () => {
    const onValueChange = vi.fn();
    renderSlider({ defaultValue: 30, step: 10, onValueChange });
    const thumb = screen.getByRole("slider");
    fireEvent.keyDown(thumb, { key: "ArrowDown" });
    expect(onValueChange).toHaveBeenCalledWith(20);
  });

  test("Home key sets value to min", () => {
    const onValueChange = vi.fn();
    renderSlider({ defaultValue: 50, min: 0, max: 100, onValueChange });
    const thumb = screen.getByRole("slider");
    fireEvent.keyDown(thumb, { key: "Home" });
    expect(onValueChange).toHaveBeenCalledWith(0);
  });

  test("End key sets value to max", () => {
    const onValueChange = vi.fn();
    renderSlider({ defaultValue: 50, min: 0, max: 100, onValueChange });
    const thumb = screen.getByRole("slider");
    fireEvent.keyDown(thumb, { key: "End" });
    expect(onValueChange).toHaveBeenCalledWith(100);
  });

  test("value is clamped to max", () => {
    const onValueChange = vi.fn();
    renderSlider({ defaultValue: 98, min: 0, max: 100, step: 5, onValueChange });
    const thumb = screen.getByRole("slider");
    fireEvent.keyDown(thumb, { key: "ArrowRight" });
    expect(onValueChange).toHaveBeenCalledWith(100);
  });

  test("value is clamped to min", () => {
    const onValueChange = vi.fn();
    renderSlider({ defaultValue: 2, min: 0, max: 100, step: 5, onValueChange });
    const thumb = screen.getByRole("slider");
    fireEvent.keyDown(thumb, { key: "ArrowLeft" });
    expect(onValueChange).toHaveBeenCalledWith(0);
  });

  test("thumb is not focusable when disabled", () => {
    renderSlider({ disabled: true });
    const thumb = screen.getByRole("slider");
    expect(thumb).toHaveAttribute("tabindex", "-1");
  });

  test("root has data-orientation attribute", () => {
    const { container } = renderSlider({ orientation: "vertical" });
    const root = container.firstElementChild;
    expect(root).toHaveAttribute("data-orientation", "vertical");
  });
});
