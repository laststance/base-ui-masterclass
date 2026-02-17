import * as React from "react";
import { createPortal } from "react-dom";

/**
 * Headless Tooltip component with compound components.
 *
 * Provides hover/focus-triggered overlay with configurable delay,
 * ARIA tooltip role, and portal rendering.
 *
 * @example
 * <Tooltip.Root>
 *   <Tooltip.Trigger>
 *     <button aria-label="Save"><SaveIcon /></button>
 *   </Tooltip.Trigger>
 *   <Tooltip.Content>Save your changes</Tooltip.Content>
 * </Tooltip.Root>
 */

interface TooltipContextValue {
  open: boolean;
  show: () => void;
  hide: () => void;
  hideImmediately: () => void;
  tooltipId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  floatingRef: React.RefObject<HTMLDivElement | null>;
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

function useTooltipContext(): TooltipContextValue {
  const ctx = React.useContext(TooltipContext);
  if (!ctx)
    throw new Error("Tooltip components must be used within Tooltip.Root");
  return ctx;
}

/**
 * Root component that manages tooltip open state with delay timers.
 *
 * @param openDelay - Milliseconds before the tooltip appears (default: 400)
 * @param closeDelay - Milliseconds before the tooltip disappears (default: 100)
 * @param children - Tooltip.Trigger and Tooltip.Content
 *
 * @example
 * <Tooltip.Root openDelay={300} closeDelay={150}>
 *   {children}
 * </Tooltip.Root>
 */
function Root({
  openDelay = 400,
  closeDelay = 100,
  children,
}: {
  openDelay?: number;
  closeDelay?: number;
  children: React.ReactNode;
}) {
  const tooltipId = React.useId();
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const floatingRef = React.useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  const show = React.useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(true), openDelay);
  }, [openDelay]);

  const hide = React.useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(false), closeDelay);
  }, [closeDelay]);

  const hideImmediately = React.useCallback(() => {
    clearTimeout(timeoutRef.current);
    setOpen(false);
  }, []);

  React.useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const ctx = React.useMemo(
    () => ({
      open,
      show,
      hide,
      hideImmediately,
      tooltipId,
      triggerRef,
      floatingRef,
    }),
    [open, show, hide, hideImmediately, tooltipId],
  );

  return <TooltipContext value={ctx}>{children}</TooltipContext>;
}

/**
 * Wraps the trigger element with hover/focus event handlers.
 * Uses cloneElement to inject props without adding a wrapper DOM node.
 *
 * @param children - A single React element to use as the trigger
 *
 * @example
 * <Tooltip.Trigger>
 *   <button>Hover me</button>
 * </Tooltip.Trigger>
 */
function Trigger({ children }: { children: React.ReactElement }) {
  const { open, show, hide, hideImmediately, tooltipId, triggerRef } =
    useTooltipContext();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      hideImmediately();
    }
  };

  return React.cloneElement(children, {
    ref: triggerRef,
    "aria-describedby": open ? tooltipId : undefined,
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hideImmediately,
    onKeyDown: handleKeyDown,
  });
}

/**
 * The tooltip content rendered through a portal.
 * Only mounts when the tooltip is open.
 *
 * @param children - The tooltip text or content
 *
 * @example
 * <Tooltip.Content className="tooltip">
 *   Save your changes
 * </Tooltip.Content>
 */
function Content({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { open, tooltipId, floatingRef } = useTooltipContext();

  if (!open) return null;

  return createPortal(
    <div ref={floatingRef} id={tooltipId} role="tooltip" {...props}>
      {children}
    </div>,
    document.body,
  );
}

export const Tooltip = { Root, Trigger, Content };
