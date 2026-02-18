import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Progress } from "./initial";

describe("Progress", () => {
  test("renders with role='progressbar'", () => {
    render(
      <Progress.Root value={50}>
        <Progress.Indicator />
      </Progress.Root>,
    );
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toBeDefined();
  });

  test("sets aria-valuenow to the current value", () => {
    render(
      <Progress.Root value={60}>
        <Progress.Indicator />
      </Progress.Root>,
    );
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow", "60");
  });

  test("sets aria-valuemin and aria-valuemax", () => {
    render(
      <Progress.Root value={30} min={0} max={100}>
        <Progress.Indicator />
      </Progress.Root>,
    );
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "100");
  });

  test("calculates correct percentage with custom min/max", () => {
    render(
      <Progress.Root value={75} min={50} max={100}>
        <Progress.Indicator data-testid="indicator" />
      </Progress.Root>,
    );
    const progressbar = screen.getByRole("progressbar");
    // 75 out of 50-100 range = 50%
    expect(progressbar.style.getPropertyValue("--progress-value")).toBe("50%");
  });

  test("shows data-state='determinate' when value is provided", () => {
    render(
      <Progress.Root value={50}>
        <Progress.Indicator />
      </Progress.Root>,
    );
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("data-state", "determinate");
  });

  test("shows data-state='indeterminate' when value is null", () => {
    render(
      <Progress.Root value={null}>
        <Progress.Indicator />
      </Progress.Root>,
    );
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("data-state", "indeterminate");
  });

  test("omits aria-valuenow when indeterminate", () => {
    render(
      <Progress.Root value={null}>
        <Progress.Indicator />
      </Progress.Root>,
    );
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).not.toHaveAttribute("aria-valuenow");
  });

  test("sets indicator width to calculated percentage", () => {
    render(
      <Progress.Root value={40}>
        <Progress.Indicator data-testid="indicator" />
      </Progress.Root>,
    );
    const indicator = screen.getByTestId("indicator");
    expect(indicator.style.width).toBe("40%");
  });
});
