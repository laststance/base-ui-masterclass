import { render, screen, fireEvent, act } from "@testing-library/react";
import { Tooltip } from "./initial";

function renderTooltip(props: { openDelay?: number; closeDelay?: number } = {}) {
  return render(
    <Tooltip.Root openDelay={props.openDelay ?? 0} closeDelay={props.closeDelay ?? 0}>
      <Tooltip.Trigger>
        <button>Hover me</button>
      </Tooltip.Trigger>
      <Tooltip.Content>Tooltip text</Tooltip.Content>
    </Tooltip.Root>,
  );
}

describe("Tooltip", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("tooltip is hidden by default", () => {
    renderTooltip();
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  test("tooltip appears on mouseenter after delay", () => {
    renderTooltip({ openDelay: 100 });
    const trigger = screen.getByRole("button", { name: "Hover me" });

    fireEvent.mouseEnter(trigger);
    expect(screen.queryByRole("tooltip")).toBeNull();

    act(() => jest.advanceTimersByTime(100));
    expect(screen.getByRole("tooltip")).toBeDefined();
  });

  test("tooltip disappears on mouseleave after delay", () => {
    renderTooltip({ openDelay: 0, closeDelay: 50 });
    const trigger = screen.getByRole("button", { name: "Hover me" });

    fireEvent.mouseEnter(trigger);
    act(() => jest.advanceTimersByTime(0));
    expect(screen.getByRole("tooltip")).toBeDefined();

    fireEvent.mouseLeave(trigger);
    act(() => jest.advanceTimersByTime(50));
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  test("tooltip appears on focus", () => {
    renderTooltip({ openDelay: 0 });
    const trigger = screen.getByRole("button", { name: "Hover me" });

    fireEvent.focus(trigger);
    act(() => jest.advanceTimersByTime(0));
    expect(screen.getByRole("tooltip")).toBeDefined();
  });

  test("tooltip disappears immediately on blur", () => {
    renderTooltip({ openDelay: 0 });
    const trigger = screen.getByRole("button", { name: "Hover me" });

    fireEvent.focus(trigger);
    act(() => jest.advanceTimersByTime(0));
    expect(screen.getByRole("tooltip")).toBeDefined();

    fireEvent.blur(trigger);
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  test("tooltip has role='tooltip'", () => {
    renderTooltip({ openDelay: 0 });
    const trigger = screen.getByRole("button", { name: "Hover me" });

    fireEvent.mouseEnter(trigger);
    act(() => jest.advanceTimersByTime(0));

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toBeDefined();
  });

  test("trigger has aria-describedby when tooltip is open", () => {
    renderTooltip({ openDelay: 0 });
    const trigger = screen.getByRole("button", { name: "Hover me" });

    expect(trigger.getAttribute("aria-describedby")).toBeNull();

    fireEvent.mouseEnter(trigger);
    act(() => jest.advanceTimersByTime(0));

    const tooltip = screen.getByRole("tooltip");
    expect(trigger.getAttribute("aria-describedby")).toBe(tooltip.id);
  });

  test("trigger does not have aria-describedby when tooltip is closed", () => {
    renderTooltip({ openDelay: 0 });
    const trigger = screen.getByRole("button", { name: "Hover me" });

    expect(trigger.getAttribute("aria-describedby")).toBeNull();
  });

  test("Escape key hides tooltip immediately", () => {
    renderTooltip({ openDelay: 0 });
    const trigger = screen.getByRole("button", { name: "Hover me" });

    fireEvent.mouseEnter(trigger);
    act(() => jest.advanceTimersByTime(0));
    expect(screen.getByRole("tooltip")).toBeDefined();

    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  test("tooltip renders through a portal into document.body", () => {
    renderTooltip({ openDelay: 0 });
    const trigger = screen.getByRole("button", { name: "Hover me" });

    fireEvent.mouseEnter(trigger);
    act(() => jest.advanceTimersByTime(0));

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.closest("body")).toBe(document.body);
  });

  test("tooltip displays the provided content", () => {
    renderTooltip({ openDelay: 0 });
    const trigger = screen.getByRole("button", { name: "Hover me" });

    fireEvent.mouseEnter(trigger);
    act(() => jest.advanceTimersByTime(0));

    expect(screen.getByRole("tooltip").textContent).toBe("Tooltip text");
  });

  test("cancels open if mouseleave happens before delay completes", () => {
    renderTooltip({ openDelay: 200 });
    const trigger = screen.getByRole("button", { name: "Hover me" });

    fireEvent.mouseEnter(trigger);
    act(() => jest.advanceTimersByTime(100));
    fireEvent.mouseLeave(trigger);
    act(() => jest.advanceTimersByTime(200));

    expect(screen.queryByRole("tooltip")).toBeNull();
  });
});
