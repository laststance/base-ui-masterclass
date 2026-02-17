import * as React from "react";

/**
 * TODO: Build a headless Menu component with compound components.
 *
 * Requirements:
 * 1. Menu.Root manages open state and item registration
 * 2. Menu.Trigger renders a button with aria-haspopup="menu" and aria-expanded
 * 3. Menu.Content renders a ul with role="menu" (only when open)
 * 4. Menu.Item renders a li with role="menuitem"
 * 5. Menu.Separator renders a li with role="separator"
 * 6. When menu opens, focus moves to the first menu item
 * 7. ArrowDown/ArrowUp navigate items with wrapping
 * 8. Home/End jump to first/last item
 * 9. Enter/Space activates the item (calls onSelect) and closes the menu
 * 10. Escape closes the menu and returns focus to the trigger
 */

interface MenuItemProps {
  onSelect?: () => void;
  disabled?: boolean;
}

interface MenuContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  items: React.RefObject<HTMLElement[]>;
  registerItem: (el: HTMLElement) => void;
  menuId: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  closeMenu: () => void;
}

const MenuContext = React.createContext<MenuContextValue | null>(null);

function useMenuContext(): MenuContextValue {
  const ctx = React.useContext(MenuContext);
  if (!ctx) throw new Error("Menu components must be used within Menu.Root");
  return ctx;
}

function Root({ children }: { children: React.ReactNode }) {
  // Your implementation here
  return <>{children}</>;
}

function Trigger({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  // Your implementation here
  return <button {...props}>{children}</button>;
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
}: MenuItemProps & React.ComponentPropsWithoutRef<"li">) {
  // Your implementation here
  return <li {...props}>{children}</li>;
}

function Separator(props: React.ComponentPropsWithoutRef<"li">) {
  return <li role="separator" {...props} />;
}

export const Menu = { Root, Trigger, Content, Item, Separator };
