import { render, screen, fireEvent } from "@testing-library/react";
import { ContextMenu } from "./initial";

function renderContextMenu() {
  const onCopy = jest.fn();
  const onPaste = jest.fn();
  const onDelete = jest.fn();

  const result = render(
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div data-testid="trigger-area">Right-click here</div>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item onSelect={onCopy}>Copy</ContextMenu.Item>
        <ContextMenu.Item onSelect={onPaste}>Paste</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item onSelect={onDelete}>Delete</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>,
  );

  return { ...result, onCopy, onPaste, onDelete };
}

function openContextMenu() {
  const triggerArea = screen.getByTestId("trigger-area");
  fireEvent.contextMenu(triggerArea, { clientX: 100, clientY: 200 });
}

describe("ContextMenu", () => {
  test("does not render menu by default", () => {
    renderContextMenu();
    expect(screen.queryByRole("menu")).toBeNull();
  });

  test("right-click opens the context menu", () => {
    renderContextMenu();
    openContextMenu();
    expect(screen.getByRole("menu")).toBeDefined();
  });

  test("context menu has role='menu'", () => {
    renderContextMenu();
    openContextMenu();
    expect(screen.getByRole("menu")).toBeDefined();
  });

  test("renders menu items with role='menuitem'", () => {
    renderContextMenu();
    openContextMenu();
    const items = screen.getAllByRole("menuitem");
    expect(items).toHaveLength(3);
  });

  test("renders separator with role='separator'", () => {
    renderContextMenu();
    openContextMenu();
    expect(screen.getByRole("separator")).toBeDefined();
  });

  test("menu is positioned at pointer coordinates", () => {
    renderContextMenu();
    openContextMenu();
    const menu = screen.getByRole("menu");
    expect(menu.style.position).toBe("fixed");
    expect(menu.style.left).toBe("100px");
    expect(menu.style.top).toBe("200px");
  });

  test("clicking a menu item calls onSelect and closes menu", () => {
    const { onCopy } = renderContextMenu();
    openContextMenu();
    fireEvent.click(screen.getByRole("menuitem", { name: "Copy" }));
    expect(onCopy).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).toBeNull();
  });

  test("Escape closes the menu", () => {
    renderContextMenu();
    openContextMenu();
    const menu = screen.getByRole("menu");
    fireEvent.keyDown(menu, { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
  });

  test("ArrowDown wraps from last to first item", () => {
    renderContextMenu();
    openContextMenu();
    const items = screen.getAllByRole("menuitem");
    const menu = screen.getByRole("menu");

    items[2].focus();
    fireEvent.keyDown(menu, { key: "ArrowDown" });

    expect(document.activeElement).toBe(items[0]);
  });

  test("ArrowUp wraps from first to last item", () => {
    renderContextMenu();
    openContextMenu();
    const items = screen.getAllByRole("menuitem");
    const menu = screen.getByRole("menu");

    items[0].focus();
    fireEvent.keyDown(menu, { key: "ArrowUp" });

    expect(document.activeElement).toBe(items[2]);
  });

  test("Home key moves focus to first item", () => {
    renderContextMenu();
    openContextMenu();
    const items = screen.getAllByRole("menuitem");
    const menu = screen.getByRole("menu");

    items[2].focus();
    fireEvent.keyDown(menu, { key: "Home" });

    expect(document.activeElement).toBe(items[0]);
  });

  test("End key moves focus to last item", () => {
    renderContextMenu();
    openContextMenu();
    const items = screen.getAllByRole("menuitem");
    const menu = screen.getByRole("menu");

    items[0].focus();
    fireEvent.keyDown(menu, { key: "End" });

    expect(document.activeElement).toBe(items[2]);
  });

  test("Enter on menu item calls onSelect and closes menu", () => {
    const { onPaste } = renderContextMenu();
    openContextMenu();
    const pasteItem = screen.getByRole("menuitem", { name: "Paste" });
    pasteItem.focus();
    fireEvent.keyDown(pasteItem, { key: "Enter" });
    expect(onPaste).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).toBeNull();
  });

  test("prevents native context menu on right-click", () => {
    renderContextMenu();
    const triggerArea = screen.getByTestId("trigger-area");
    const event = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
      clientX: 50,
      clientY: 75,
    });
    const defaultPrevented = !triggerArea.dispatchEvent(event);
    expect(defaultPrevented).toBe(true);
  });
});
