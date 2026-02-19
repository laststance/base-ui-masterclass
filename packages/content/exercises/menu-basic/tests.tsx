import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Menu } from "./initial";

function renderMenu() {
  const onCopy = jest.fn();
  const onPaste = jest.fn();
  const onDelete = jest.fn();

  const result = render(
    <Menu.Root>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Content>
        <Menu.Item onSelect={onCopy}>Copy</Menu.Item>
        <Menu.Item onSelect={onPaste}>Paste</Menu.Item>
        <Menu.Separator />
        <Menu.Item onSelect={onDelete}>Delete</Menu.Item>
      </Menu.Content>
    </Menu.Root>,
  );

  return { ...result, onCopy, onPaste, onDelete };
}

describe("Menu", () => {
  test("renders a trigger button", () => {
    renderMenu();
    expect(screen.getByRole("button", { name: "Actions" })).toBeDefined();
  });

  test("trigger has aria-haspopup='menu'", () => {
    renderMenu();
    expect(screen.getByRole("button", { name: "Actions" })).toHaveAttribute(
      "aria-haspopup",
      "menu",
    );
  });

  test("trigger has aria-expanded='false' when closed", () => {
    renderMenu();
    expect(screen.getByRole("button", { name: "Actions" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  test("clicking the trigger opens the menu", () => {
    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: "Actions" }));
    expect(screen.getByRole("menu")).toBeDefined();
    expect(screen.getByRole("button", { name: "Actions" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  test("renders menu items with role='menuitem'", () => {
    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: "Actions" }));
    const items = screen.getAllByRole("menuitem");
    expect(items).toHaveLength(3);
  });

  test("renders separator with role='separator'", () => {
    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: "Actions" }));
    expect(screen.getByRole("separator")).toBeDefined();
  });

  test("clicking a menu item calls onSelect and closes menu", () => {
    const { onCopy } = renderMenu();
    fireEvent.click(screen.getByRole("button", { name: "Actions" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Copy" }));
    expect(onCopy).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).toBeNull();
  });

  test("Escape closes the menu", () => {
    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: "Actions" }));
    const menu = screen.getByRole("menu");
    fireEvent.keyDown(menu, { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
  });

  test("ArrowDown wraps from last to first item", () => {
    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: "Actions" }));
    const items = screen.getAllByRole("menuitem");

    // Navigate to last item
    const menu = screen.getByRole("menu");
    items[2].focus();
    fireEvent.keyDown(menu, { key: "ArrowDown" });

    // Should wrap to first
    expect(document.activeElement).toBe(items[0]);
  });

  test("ArrowUp wraps from first to last item", () => {
    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: "Actions" }));
    const items = screen.getAllByRole("menuitem");

    items[0].focus();
    const menu = screen.getByRole("menu");
    fireEvent.keyDown(menu, { key: "ArrowUp" });

    // Should wrap to last
    expect(document.activeElement).toBe(items[2]);
  });

  test("Home key moves focus to first item", () => {
    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: "Actions" }));
    const items = screen.getAllByRole("menuitem");

    items[2].focus();
    const menu = screen.getByRole("menu");
    fireEvent.keyDown(menu, { key: "Home" });

    expect(document.activeElement).toBe(items[0]);
  });

  test("End key moves focus to last item", () => {
    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: "Actions" }));
    const items = screen.getAllByRole("menuitem");

    items[0].focus();
    const menu = screen.getByRole("menu");
    fireEvent.keyDown(menu, { key: "End" });

    expect(document.activeElement).toBe(items[2]);
  });

  test("trigger has aria-controls pointing to the menu", () => {
    renderMenu();
    const trigger = screen.getByRole("button", { name: "Actions" });
    fireEvent.click(trigger);
    const controlsId = trigger.getAttribute("aria-controls");
    const menu = screen.getByRole("menu");
    expect(controlsId).toBeTruthy();
    expect(menu.id).toBe(controlsId);
  });

  test("Enter on menu item calls onSelect and closes menu", () => {
    const { onPaste } = renderMenu();
    fireEvent.click(screen.getByRole("button", { name: "Actions" }));
    const pasteItem = screen.getByRole("menuitem", { name: "Paste" });
    pasteItem.focus();
    fireEvent.keyDown(pasteItem, { key: "Enter" });
    expect(onPaste).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).toBeNull();
  });
});
