import * as React from "react";

/**
 * A headless Menu component built with compound components.
 *
 * Implements the WAI-ARIA menu pattern with a trigger button that opens
 * a dropdown of actionable items. DOM focus moves into the menu
 * when opened and returns to the trigger when closed.
 *
 * @example
 * <Menu.Root>
 *   <Menu.Trigger>Actions</Menu.Trigger>
 *   <Menu.Content>
 *     <Menu.Item onSelect={() => console.log("copy")}>Copy</Menu.Item>
 *     <Menu.Item onSelect={() => console.log("paste")}>Paste</Menu.Item>
 *     <Menu.Separator />
 *     <Menu.Item onSelect={() => console.log("delete")}>Delete</Menu.Item>
 *   </Menu.Content>
 * </Menu.Root>
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
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const items = React.useRef<HTMLElement[]>([]);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuId = `menu-${React.useId()}`;

  const registerItem = React.useCallback((el: HTMLElement) => {
    if (!items.current.includes(el)) {
      items.current.push(el);
    }
  }, []);

  const closeMenu = React.useCallback(() => {
    setIsOpen(false);
    setActiveIndex(0);
    triggerRef.current?.focus();
  }, []);

  const ctx = React.useMemo(
    () => ({
      isOpen,
      setIsOpen,
      activeIndex,
      setActiveIndex,
      items,
      registerItem,
      menuId,
      triggerRef,
      closeMenu,
    }),
    [isOpen, activeIndex, registerItem, menuId, closeMenu],
  );

  return <MenuContext value={ctx}>{children}</MenuContext>;
}

function Trigger({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  const { isOpen, setIsOpen, setActiveIndex, items, menuId, triggerRef } =
    useMenuContext();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
      case "Enter":
      case " ": {
        e.preventDefault();
        setIsOpen(true);
        setActiveIndex(0);
        requestAnimationFrame(() => {
          items.current[0]?.focus();
        });
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        setIsOpen(true);
        const lastIndex = items.current.length - 1;
        setActiveIndex(lastIndex);
        requestAnimationFrame(() => {
          items.current[lastIndex]?.focus();
        });
        break;
      }
    }
  };

  return (
    <button
      ref={triggerRef}
      type="button"
      aria-haspopup="menu"
      aria-expanded={isOpen}
      aria-controls={menuId}
      onClick={() => {
        if (isOpen) {
          setIsOpen(false);
        } else {
          setIsOpen(true);
          setActiveIndex(0);
          requestAnimationFrame(() => {
            items.current[0]?.focus();
          });
        }
      }}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </button>
  );
}

function Content({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"ul">) {
  const { isOpen, activeIndex, setActiveIndex, items, menuId, closeMenu } =
    useMenuContext();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const count = items.current.length;
    if (count === 0) return;

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const next = (activeIndex + 1) % count;
        setActiveIndex(next);
        items.current[next]?.focus();
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const prev = (activeIndex - 1 + count) % count;
        setActiveIndex(prev);
        items.current[prev]?.focus();
        break;
      }
      case "Home": {
        e.preventDefault();
        setActiveIndex(0);
        items.current[0]?.focus();
        break;
      }
      case "End": {
        e.preventDefault();
        const last = count - 1;
        setActiveIndex(last);
        items.current[last]?.focus();
        break;
      }
      case "Escape": {
        e.preventDefault();
        closeMenu();
        break;
      }
      case "Tab": {
        e.preventDefault();
        closeMenu();
        break;
      }
    }
  };

  if (!isOpen) return null;

  return (
    <ul role="menu" id={menuId} onKeyDown={handleKeyDown} {...props}>
      {children}
    </ul>
  );
}

function Item({
  onSelect,
  disabled = false,
  children,
  ...props
}: MenuItemProps & React.ComponentPropsWithoutRef<"li">) {
  const { registerItem, closeMenu, setActiveIndex, items } = useMenuContext();

  const ref = React.useCallback(
    (el: HTMLElement | null) => {
      if (el) registerItem(el);
    },
    [registerItem],
  );

  const handleClick = () => {
    if (disabled) return;
    onSelect?.();
    closeMenu();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <li
      ref={ref}
      role="menuitem"
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      data-disabled={disabled || undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={() => {
        const idx = items.current.indexOf(
          document.activeElement as HTMLElement,
        );
        if (idx !== -1) setActiveIndex(idx);
      }}
      {...props}
    >
      {children}
    </li>
  );
}

function Separator(props: React.ComponentPropsWithoutRef<"li">) {
  return <li role="separator" {...props} />;
}

export const Menu = { Root, Trigger, Content, Item, Separator };
