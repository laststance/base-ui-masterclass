import * as React from "react";
import { createPortal } from "react-dom";

/**
 * TODO: Build a headless Popover component with compound components.
 *
 * Requirements:
 * 1. Popover.Root manages open/close state (uncontrolled with defaultOpen)
 * 2. Popover.Trigger renders a button with aria-expanded and aria-controls
 * 3. Popover.Content renders through a portal with role="dialog"
 * 4. Clicking the trigger toggles the popover
 * 5. Focus moves to the first focusable element inside the popover when opened
 * 6. Pressing Escape closes the popover and returns focus to the trigger
 * 7. Clicking outside the popover closes it and returns focus to the trigger
 * 8. Popover.Close button closes the popover
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
  if (!ctx) throw new Error("Popover components must be used within Popover.Root");
  return ctx;
}

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

  // TODO: Implement open state management
  // Implement toggle() and close() callbacks
  const open = defaultOpen;
  const toggle = () => {};
  const close = () => {};

  const ctx = React.useMemo(
    () => ({ open, toggle, close, popoverId, triggerRef, contentRef }),
    [open, toggle, close, popoverId],
  );

  return <PopoverContext value={ctx}>{children}</PopoverContext>;
}

function Trigger({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  const { triggerRef } = usePopoverContext();

  // TODO: Add ref, aria-expanded, aria-controls, aria-haspopup, onClick
  return (
    <button ref={triggerRef} type="button" {...props}>
      {children}
    </button>
  );
}

function Content({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { open, contentRef } = usePopoverContext();

  // TODO: Render through a portal when open
  // - Set role="dialog", id, tabIndex={-1}
  // - Focus first focusable element on open
  // - Listen for Escape key (close + return focus)
  // - Listen for outside clicks (close + return focus)
  if (!open) return null;

  return <div ref={contentRef} {...props}>{children}</div>;
}

function Close({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  // TODO: Close the popover and return focus to trigger on click
  return (
    <button type="button" {...props}>
      {children}
    </button>
  );
}

export const Popover = { Root, Trigger, Content, Close };
