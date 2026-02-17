import * as React from "react";

/**
 * TODO: Build a headless ScrollArea component.
 *
 * Requirements:
 * 1. ScrollArea.Root sets up the container with relative positioning and overflow hidden
 * 2. ScrollArea.Viewport is the scrollable content area with native overflow: scroll
 *    and hidden native scrollbars
 * 3. ScrollArea.Scrollbar is the custom scrollbar track, only visible when content overflows
 * 4. ScrollArea.Thumb is the draggable handle sized proportionally to content ratio
 * 5. Thumb position reflects current scroll position
 * 6. Dragging the thumb scrolls the viewport
 * 7. Clicking the track jumps the scroll position
 * 8. Use ResizeObserver to update on dynamic content changes
 */

interface ScrollAreaContextValue {
  viewportRef: React.RefObject<HTMLDivElement | null>;
  thumbRef: React.RefObject<HTMLDivElement | null>;
  scrollbarRef: React.RefObject<HTMLDivElement | null>;
  thumbSize: number;
  thumbPosition: number;
  isScrollable: boolean;
}

const ScrollAreaContext =
  React.createContext<ScrollAreaContextValue | null>(null);

function useScrollAreaContext(): ScrollAreaContextValue {
  const ctx = React.useContext(ScrollAreaContext);
  if (!ctx)
    throw new Error(
      "ScrollArea sub-components must be used within ScrollArea.Root",
    );
  return ctx;
}

function Root({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // TODO: Implement the root component
  // 1. Create refs for viewport, thumb, and scrollbar
  // 2. Track thumbSize, thumbPosition, and isScrollable state
  // 3. Create updateScrollbar callback that calculates thumb size and position
  // 4. Set up scroll event listener and ResizeObserver in useEffect
  // 5. Provide context to children
  return (
    <div style={{ position: "relative", overflow: "hidden" }} {...props}>
      {children}
    </div>
  );
}

function Viewport({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // TODO: Implement viewport
  // 1. Attach viewportRef
  // 2. Set overflow: scroll and hide native scrollbars
  return <div {...props}>{children}</div>;
}

function Scrollbar({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // TODO: Implement scrollbar track
  // 1. Attach scrollbarRef
  // 2. Return null if not scrollable
  // 3. Handle click on track to jump scroll position
  return <div {...props}>{children}</div>;
}

function Thumb(props: React.ComponentPropsWithoutRef<"div">) {
  // TODO: Implement scrollbar thumb
  // 1. Attach thumbRef
  // 2. Position with top: thumbPosition and height: thumbSize
  // 3. Handle pointerdown with setPointerCapture for drag
  // 4. Handle pointermove to scroll viewport during drag
  return <div {...props} />;
}

export const ScrollArea = { Root, Viewport, Scrollbar, Thumb };
