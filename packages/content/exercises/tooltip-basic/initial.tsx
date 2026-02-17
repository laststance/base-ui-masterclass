import * as React from "react";
import { createPortal } from "react-dom";

/**
 * TODO: Build a headless Tooltip component with compound components.
 *
 * Requirements:
 * 1. Tooltip.Root manages open state with configurable open/close delay
 * 2. Tooltip.Trigger wraps the child element with hover/focus handlers
 * 3. Tooltip.Content renders a portal with role="tooltip"
 * 4. The trigger has aria-describedby pointing to the tooltip id when open
 * 5. Hovering (mouseenter) or focusing the trigger shows the tooltip after openDelay
 * 6. Leaving (mouseleave) or blurring hides the tooltip after closeDelay
 * 7. Pressing Escape immediately hides the tooltip
 * 8. The tooltip renders through a portal into document.body
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
  if (!ctx) throw new Error("Tooltip components must be used within Tooltip.Root");
  return ctx;
}

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

  // TODO: Implement delayed open/close state management
  // Use timeoutRef to manage delay timers
  // Implement show(), hide(), hideImmediately()
  const open = false;
  const show = () => {};
  const hide = () => {};
  const hideImmediately = () => {};

  const ctx = React.useMemo(
    () => ({ open, show, hide, hideImmediately, tooltipId, triggerRef, floatingRef }),
    [open, show, hide, hideImmediately, tooltipId],
  );

  return <TooltipContext value={ctx}>{children}</TooltipContext>;
}

function Trigger({ children }: { children: React.ReactElement }) {
  const { tooltipId, triggerRef } = useTooltipContext();

  // TODO: Clone the child element and inject:
  // - ref (triggerRef)
  // - aria-describedby (tooltipId when open, undefined when closed)
  // - onMouseEnter → show
  // - onMouseLeave → hide
  // - onFocus → show
  // - onBlur → hideImmediately
  // - onKeyDown → Escape hides immediately
  return <>{children}</>;
}

function Content({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { open, tooltipId, floatingRef } = useTooltipContext();

  // TODO: Render through a portal when open
  // - Use role="tooltip"
  // - Set id to tooltipId
  // - Use floatingRef
  if (!open) return null;

  return <div {...props}>{children}</div>;
}

export const Tooltip = { Root, Trigger, Content };
