import * as React from "react";

/**
 * A headless ContextMenu component built with compound components.
 *
 * Implements the WAI-ARIA menu pattern with a right-click trigger.
 * The menu appears at the pointer position and uses the same keyboard
 * navigation as a regular dropdown Menu.
 *
 * @example
 * <ContextMenu.Root>
 *   <ContextMenu.Trigger>
 *     <div style={{ width: 300, height: 200, border: "1px dashed gray" }}>
 *       Right-click here
 *     </div>
 *   </ContextMenu.Trigger>
 *   <ContextMenu.Content>
 *     <ContextMenu.Item onSelect={() => console.log("copy")}>Copy</ContextMenu.Item>
 *     <ContextMenu.Item onSelect={() => console.log("paste")}>Paste</ContextMenu.Item>
 *     <ContextMenu.Separator />
 *     <ContextMenu.Item onSelect={() => console.log("delete")}>Delete</ContextMenu.Item>
 *   </ContextMenu.Content>
 * </ContextMenu.Root>
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
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = React.useState(0);
  const items = React.useRef<HTMLElement[]>([]);
  const menuId = `context-menu-${React.useId()}`;

  const registerItem = React.useCallback((el: HTMLElement) => {
    if (!items.current.includes(el)) {
      items.current.push(el);
    }
  }, []);

  const closeMenu = React.useCallback(() => {
    setIsOpen(false);
    setActiveIndex(0);
    items.current = [];
  }, []);

  const ctx = React.useMemo(
    () => ({
      isOpen,
      setIsOpen,
      position,
      setPosition,
      activeIndex,
      setActiveIndex,
      items,
      registerItem,
      menuId,
      closeMenu,
    }),
    [isOpen, position, activeIndex, registerItem, menuId, closeMenu],
  );

  return <ContextMenuContext value={ctx}>{children}</ContextMenuContext>;
}

function Trigger({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { setIsOpen, setPosition, setActiveIndex, items } =
    useContextMenuContext();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
    setActiveIndex(0);

    requestAnimationFrame(() => {
      items.current[0]?.focus();
    });
  };

  return (
    <div onContextMenu={handleContextMenu} {...props}>
      {children}
    </div>
  );
}

function Content({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"ul">) {
  const { isOpen, position, activeIndex, setActiveIndex, items, menuId, closeMenu } =
    useContextMenuContext();

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
    <ul
      role="menu"
      id={menuId}
      onKeyDown={handleKeyDown}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
      }}
      {...props}
    >
      {children}
    </ul>
  );
}

function Item({
  onSelect,
  disabled = false,
  children,
  ...props
}: ContextMenuItemProps & React.ComponentPropsWithoutRef<"li">) {
  const { registerItem, closeMenu, setActiveIndex, items } =
    useContextMenuContext();

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

export const ContextMenu = { Root, Trigger, Content, Item, Separator };
