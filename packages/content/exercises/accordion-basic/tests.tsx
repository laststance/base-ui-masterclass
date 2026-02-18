import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Accordion } from "./initial";

function renderAccordion(defaultValue?: string) {
  return render(
    <Accordion.Root defaultValue={defaultValue}>
      <Accordion.Item value="item-1">
        <Accordion.Trigger>Section 1</Accordion.Trigger>
        <Accordion.Panel>Content 1</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger>Section 2</Accordion.Trigger>
        <Accordion.Panel>Content 2</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Trigger>Section 3</Accordion.Trigger>
        <Accordion.Panel>Content 3</Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>,
  );
}

describe("Accordion", () => {
  test("renders all triggers", () => {
    renderAccordion();
    expect(screen.getByRole("button", { name: "Section 1" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Section 2" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Section 3" })).toBeDefined();
  });

  test("all panels are closed by default when no defaultValue", () => {
    renderAccordion();
    const triggers = screen.getAllByRole("button");
    triggers.forEach((trigger) => {
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  test("opens the item matching defaultValue", () => {
    renderAccordion("item-2");
    const trigger = screen.getByRole("button", { name: "Section 2" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  test("clicking a trigger opens its panel", () => {
    renderAccordion();
    const trigger = screen.getByRole("button", { name: "Section 1" });

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  test("single-expand mode: opening one item closes another", () => {
    renderAccordion("item-1");
    const trigger1 = screen.getByRole("button", { name: "Section 1" });
    const trigger2 = screen.getByRole("button", { name: "Section 2" });

    expect(trigger1).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(trigger2);
    expect(trigger2).toHaveAttribute("aria-expanded", "true");
    expect(trigger1).toHaveAttribute("aria-expanded", "false");
  });

  test("clicking an open trigger closes it", () => {
    renderAccordion("item-1");
    const trigger = screen.getByRole("button", { name: "Section 1" });

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("trigger has aria-controls pointing to panel", () => {
    renderAccordion("item-1");
    const trigger = screen.getByRole("button", { name: "Section 1" });
    const panelId = trigger.getAttribute("aria-controls");

    expect(panelId).toBeTruthy();
    const panel = document.getElementById(panelId!);
    expect(panel).toBeTruthy();
    expect(panel).toHaveAttribute("role", "region");
  });

  test("panel has aria-labelledby pointing to trigger", () => {
    renderAccordion("item-1");
    const trigger = screen.getByRole("button", { name: "Section 1" });
    const panelId = trigger.getAttribute("aria-controls");
    const panel = document.getElementById(panelId!);

    expect(panel).toHaveAttribute("aria-labelledby", trigger.id);
  });

  test("closed panels have hidden attribute", () => {
    renderAccordion("item-1");
    const trigger2 = screen.getByRole("button", { name: "Section 2" });
    const panelId2 = trigger2.getAttribute("aria-controls");
    const panel2 = document.getElementById(panelId2!);

    expect(panel2).toHaveAttribute("hidden");
  });

  test("ArrowDown moves focus to next trigger", () => {
    renderAccordion();
    const trigger1 = screen.getByRole("button", { name: "Section 1" });
    const trigger2 = screen.getByRole("button", { name: "Section 2" });

    trigger1.focus();
    fireEvent.keyDown(trigger1, { key: "ArrowDown" });
    expect(document.activeElement).toBe(trigger2);
  });

  test("ArrowUp moves focus to previous trigger", () => {
    renderAccordion();
    const trigger1 = screen.getByRole("button", { name: "Section 1" });
    const trigger2 = screen.getByRole("button", { name: "Section 2" });

    trigger2.focus();
    fireEvent.keyDown(trigger2, { key: "ArrowUp" });
    expect(document.activeElement).toBe(trigger1);
  });

  test("data-state reflects open/closed state on items", () => {
    renderAccordion("item-1");
    const trigger1 = screen.getByRole("button", { name: "Section 1" });
    const trigger2 = screen.getByRole("button", { name: "Section 2" });

    expect(trigger1).toHaveAttribute("data-state", "open");
    expect(trigger2).toHaveAttribute("data-state", "closed");
  });
});
