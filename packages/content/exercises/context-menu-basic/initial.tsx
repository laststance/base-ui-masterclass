import * as React from "react";

/**
 * TODO: Build a headless ContextMenu component with compound components.
 *
 * Requirements:
 * 1. ContextMenu.Root manages open state, pointer position, and item registration
 * 2. ContextMenu.Trigger renders a div that listens for the 'contextmenu' event (right-click)
 * 3. The contextmenu event handler calls e.preventDefault() and stores clientX/clientY
 * 4. ContextMenu.Content renders a ul with role="menu" at the pointer position (position: fixed)
 * 5. ContextMenu.Item renders a li with role="menuitem"
 * 6. ContextMenu.Separator renders a li with role="separator"
 * 7. When menu opens, focus moves to the first menu item
 * 8. ArrowDown/ArrowUp navigate items with wrapping
 * 9. Home/End jump to first/last item
 * 10. Enter/Space activates the item (calls onSelect) and closes the menu
 * 11. Escape closes the menu
 */

interface ContextMenuItemProps {
  onSelect?: () => void;
  disabled?: boolean;
}

interface ContextMenuContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  items: React.RefObject<HTMLElement[]>;
  registerItem: (el: HTMLElement) => void;
  menuId: string;
  closeMenu: () => void;
}

const ContextMenuContext =
  React.createContext<ContextMenuContextValue | null>(null);

function useContextMenuContext(): ContextMenuContextValue {
  const ctx = React.useContext(ContextMenuContext);
  if (!ctx)
    throw new Error(
      "ContextMenu components must be used within ContextMenu.Root",
    );
  return ctx;
}

function Root({ children }: { children: React.ReactNode }) {
  // Your implementation here
  return <>{children}</>;
}

function Trigger({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // Your implementation here
  return <div {...props}>{children}</div>;
}

function Content({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"ul">) {
  // Your implementation here
  return null;
}

function Item({
  onSelect,
  disabled = false,
  children,
  ...props
}: ContextMenuItemProps & React.ComponentPropsWithoutRef<"li">) {
  // Your implementation here
  return <li {...props}>{children}</li>;
}

function Separator(props: React.ComponentPropsWithoutRef<"li">) {
  return <li role="separator" {...props} />;
}

export const ContextMenu = { Root, Trigger, Content, Item, Separator };
