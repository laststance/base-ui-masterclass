import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Tabs } from "./initial";

function renderTabs(defaultValue = "tab-1") {
  return render(
    <Tabs.Root defaultValue={defaultValue}>
      <Tabs.List aria-label="Settings">
        <Tabs.Tab value="tab-1">General</Tabs.Tab>
        <Tabs.Tab value="tab-2">Security</Tabs.Tab>
        <Tabs.Tab value="tab-3">Notifications</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="tab-1">General settings content</Tabs.Panel>
      <Tabs.Panel value="tab-2">Security settings content</Tabs.Panel>
      <Tabs.Panel value="tab-3">Notification settings content</Tabs.Panel>
    </Tabs.Root>,
  );
}

describe("Tabs", () => {
  test("renders a tablist", () => {
    renderTabs();
    expect(screen.getByRole("tablist")).toBeDefined();
  });

  test("renders tabs with role='tab'", () => {
    renderTabs();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);
  });

  test("selected tab has aria-selected='true'", () => {
    renderTabs("tab-1");
    const tab1 = screen.getByRole("tab", { name: "General" });
    const tab2 = screen.getByRole("tab", { name: "Security" });

    expect(tab1).toHaveAttribute("aria-selected", "true");
    expect(tab2).toHaveAttribute("aria-selected", "false");
  });

  test("clicking a tab selects it", () => {
    renderTabs("tab-1");
    const tab2 = screen.getByRole("tab", { name: "Security" });

    fireEvent.click(tab2);
    expect(tab2).toHaveAttribute("aria-selected", "true");
  });

  test("only selected panel is visible", () => {
    renderTabs("tab-1");
    const panel = screen.getByRole("tabpanel");

    expect(panel.textContent).toBe("General settings content");
  });

  test("switching tabs changes visible panel", () => {
    renderTabs("tab-1");
    const tab2 = screen.getByRole("tab", { name: "Security" });

    fireEvent.click(tab2);
    const panel = screen.getByRole("tabpanel");
    expect(panel.textContent).toBe("Security settings content");
  });

  test("selected tab has tabIndex=0, others have tabIndex=-1", () => {
    renderTabs("tab-1");
    const tabs = screen.getAllByRole("tab");

    expect(tabs[0]).toHaveAttribute("tabindex", "0");
    expect(tabs[1]).toHaveAttribute("tabindex", "-1");
    expect(tabs[2]).toHaveAttribute("tabindex", "-1");
  });

  test("ArrowRight moves focus and selects next tab", () => {
    renderTabs("tab-1");
    const tabs = screen.getAllByRole("tab");

    tabs[0].focus();
    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });

    expect(document.activeElement).toBe(tabs[1]);
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
  });

  test("ArrowLeft moves focus and selects previous tab", () => {
    renderTabs("tab-2");
    const tabs = screen.getAllByRole("tab");

    tabs[1].focus();
    fireEvent.keyDown(tabs[1], { key: "ArrowLeft" });

    expect(document.activeElement).toBe(tabs[0]);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });

  test("ArrowRight wraps from last to first tab", () => {
    renderTabs("tab-3");
    const tabs = screen.getAllByRole("tab");

    tabs[2].focus();
    fireEvent.keyDown(tabs[2], { key: "ArrowRight" });

    expect(document.activeElement).toBe(tabs[0]);
  });

  test("Home key moves focus to first tab", () => {
    renderTabs("tab-3");
    const tabs = screen.getAllByRole("tab");

    tabs[2].focus();
    fireEvent.keyDown(tabs[2], { key: "Home" });

    expect(document.activeElement).toBe(tabs[0]);
  });

  test("End key moves focus to last tab", () => {
    renderTabs("tab-1");
    const tabs = screen.getAllByRole("tab");

    tabs[0].focus();
    fireEvent.keyDown(tabs[0], { key: "End" });

    expect(document.activeElement).toBe(tabs[2]);
  });

  test("tab has aria-controls pointing to panel", () => {
    renderTabs("tab-1");
    const tab = screen.getByRole("tab", { name: "General" });
    const controlsId = tab.getAttribute("aria-controls");
    const panel = screen.getByRole("tabpanel");

    expect(controlsId).toBeTruthy();
    expect(panel.id).toBe(controlsId);
  });

  test("calls onValueChange when tab is selected", () => {
    const onValueChange = jest.fn();
    render(
      <Tabs.Root defaultValue="tab-1" onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Tab value="tab-1">Tab 1</Tabs.Tab>
          <Tabs.Tab value="tab-2">Tab 2</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="tab-1">Panel 1</Tabs.Panel>
        <Tabs.Panel value="tab-2">Panel 2</Tabs.Panel>
      </Tabs.Root>,
    );

    fireEvent.click(screen.getByRole("tab", { name: "Tab 2" }));
    expect(onValueChange).toHaveBeenCalledWith("tab-2");
  });
});
