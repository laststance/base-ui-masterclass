import * as React from "react";
import { createPortal } from "react-dom";

/**
 * Headless Popover component with compound components.
 *
 * Provides click-triggered interactive overlay with focus management,
 * outside click dismissal, Escape key support, and portal rendering.
 *
 * @example
 * <Popover.Root>
 *   <Popover.Trigger>Open Settings</Popover.Trigger>
 *   <Popover.Content aria-label="Settings">
 *     <input placeholder="Search..." />
 *     <Popover.Close>Done</Popover.Close>
 *   </Popover.Content>
 * </Popover.Root>
 */

interface PopoverContextValue {
  open: boolean;
  toggle: () => void;
  close: () => void;
  popoverId: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

function usePopoverContext(): PopoverContextValue {
  const ctx = React.useContext(PopoverContext);
  if (!ctx)
    throw new Error("Popover components must be used within Popover.Root");
  return ctx;
}

/**
 * Root component that manages popover open/close state.
 *
 * @param defaultOpen - Whether the popover starts open (default: false)
 * @param onOpenChange - Callback when open state changes
 * @param children - Popover.Trigger and Popover.Content
 *
 * @example
 * <Popover.Root defaultOpen={false} onOpenChange={(open) => console.log(open)}>
 *   {children}
 * </Popover.Root>
 */
function Root({
  defaultOpen = false,
  onOpenChange,
  children,
}: {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const popoverId = React.useId();
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [open, setOpenState] = React.useState(defaultOpen);

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      setOpenState(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange],
  );

  const toggle = React.useCallback(() => setOpen(!open), [setOpen, open]);
  const close = React.useCallback(() => setOpen(false), [setOpen]);

  const ctx = React.useMemo(
    () => ({ open, toggle, close, popoverId, triggerRef, contentRef }),
    [open, toggle, close, popoverId],
  );

  return <PopoverContext value={ctx}>{children}</PopoverContext>;
}

/**
 * Button that toggles the popover open/closed.
 * Sets aria-expanded and aria-controls for accessibility.
 *
 * @param children - Button content
 *
 * @example
 * <Popover.Trigger>Open Settings</Popover.Trigger>
 */
function Trigger({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  const { open, toggle, popoverId, triggerRef } = usePopoverContext();

  return (
    <button
      ref={triggerRef}
      type="button"
      aria-expanded={open}
      aria-controls={open ? popoverId : undefined}
      aria-haspopup="dialog"
      onClick={toggle}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * The popover content panel rendered through a portal.
 * Manages focus on open, Escape key, and outside click dismissal.
 *
 * @param children - Interactive popover content
 *
 * @example
 * <Popover.Content aria-label="Settings panel">
 *   <input placeholder="Search..." />
 * </Popover.Content>
 */
function Content({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { open, close, popoverId, triggerRef, contentRef } =
    usePopoverContext();

  // Focus first focusable element when opened
  React.useEffect(() => {
    if (!open || !contentRef.current) return;

    const focusableSelectors = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ].join(", ");

    const firstFocusable =
      contentRef.current.querySelector<HTMLElement>(focusableSelectors);

    if (firstFocusable) {
      firstFocusable.focus();
    } else {
      contentRef.current.focus();
    }
  }, [open, contentRef]);

  // Close on Escape key
  React.useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, close, triggerRef]);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;

    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        !contentRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        close();
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open, close, triggerRef, contentRef]);

  if (!open) return null;

  return createPortal(
    <div
      ref={contentRef}
      id={popoverId}
      role="dialog"
      tabIndex={-1}
      {...props}
    >
      {children}
    </div>,
    document.body,
  );
}

/**
 * A button that closes the popover and returns focus to the trigger.
 *
 * @param children - Button content
 *
 * @example
 * <Popover.Close>Done</Popover.Close>
 */
function Close({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  const { close, triggerRef } = usePopoverContext();

  return (
    <button
      type="button"
      onClick={() => {
        close();
        triggerRef.current?.focus();
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export const Popover = { Root, Trigger, Content, Close };
