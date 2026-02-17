import * as React from "react";

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
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const thumbRef = React.useRef<HTMLDivElement>(null);
  const scrollbarRef = React.useRef<HTMLDivElement>(null);

  const [thumbSize, setThumbSize] = React.useState(0);
  const [thumbPosition, setThumbPosition] = React.useState(0);
  const [isScrollable, setIsScrollable] = React.useState(false);

  const updateScrollbar = React.useCallback(() => {
    const viewport = viewportRef.current;
    const scrollbar = scrollbarRef.current;
    if (!viewport || !scrollbar) return;

    const { scrollTop, scrollHeight, clientHeight } = viewport;
    const trackHeight = scrollbar.clientHeight;

    const hasOverflow = scrollHeight > clientHeight;
    setIsScrollable(hasOverflow);

    if (!hasOverflow) return;

    const ratio = clientHeight / scrollHeight;
    const newThumbSize = Math.max(ratio * trackHeight, 20);
    setThumbSize(newThumbSize);

    const scrollableDistance = scrollHeight - clientHeight;
    const scrollRatio =
      scrollableDistance > 0 ? scrollTop / scrollableDistance : 0;
    setThumbPosition(scrollRatio * (trackHeight - newThumbSize));
  }, []);

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    updateScrollbar();
    viewport.addEventListener("scroll", updateScrollbar, { passive: true });

    const observer = new ResizeObserver(updateScrollbar);
    observer.observe(viewport);

    return () => {
      viewport.removeEventListener("scroll", updateScrollbar);
      observer.disconnect();
    };
  }, [updateScrollbar]);

  const ctx = React.useMemo(
    () => ({
      viewportRef,
      thumbRef,
      scrollbarRef,
      thumbSize,
      thumbPosition,
      isScrollable,
    }),
    [thumbSize, thumbPosition, isScrollable],
  );

  return (
    <ScrollAreaContext value={ctx}>
      <div style={{ position: "relative", overflow: "hidden" }} {...props}>
        {children}
      </div>
    </ScrollAreaContext>
  );
}

function Viewport({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { viewportRef } = useScrollAreaContext();

  return (
    <div
      ref={viewportRef}
      data-testid="scroll-area-viewport"
      style={{
        overflow: "scroll",
        scrollbarWidth: "none",
        width: "100%",
        height: "100%",
      }}
      {...props}
    >
      {children}
    </div>
  );
}

function Scrollbar({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { scrollbarRef, viewportRef, isScrollable } = useScrollAreaContext();

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    const scrollbar = scrollbarRef.current;
    if (!viewport || !scrollbar) return;
    if (e.target !== e.currentTarget) return;

    const trackRect = scrollbar.getBoundingClientRect();
    const clickPosition = e.clientY - trackRect.top;
    const trackHeight = trackRect.height;
    const scrollRatio = clickPosition / trackHeight;
    viewport.scrollTop =
      scrollRatio * (viewport.scrollHeight - viewport.clientHeight);
  };

  if (!isScrollable) return null;

  return (
    <div
      ref={scrollbarRef}
      data-testid="scroll-area-scrollbar"
      role="scrollbar"
      aria-orientation="vertical"
      onClick={handleTrackClick}
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: 8,
        height: "100%",
      }}
      {...props}
    >
      {children}
    </div>
  );
}

function Thumb(props: React.ComponentPropsWithoutRef<"div">) {
  const { thumbRef, viewportRef, scrollbarRef, thumbSize, thumbPosition } =
    useScrollAreaContext();

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;

    const viewport = viewportRef.current;
    const scrollbar = scrollbarRef.current;
    if (!viewport || !scrollbar) return;

    const trackRect = scrollbar.getBoundingClientRect();
    const trackHeight = trackRect.height;
    const thumbPos = e.clientY - trackRect.top - thumbSize / 2;
    const scrollableTrack = trackHeight - thumbSize;
    const scrollRatio = Math.max(
      0,
      Math.min(thumbPos / scrollableTrack, 1),
    );
    viewport.scrollTop =
      scrollRatio * (viewport.scrollHeight - viewport.clientHeight);
  };

  return (
    <div
      ref={thumbRef}
      data-testid="scroll-area-thumb"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      style={{
        position: "absolute",
        top: thumbPosition,
        width: "100%",
        height: thumbSize,
        borderRadius: 4,
        cursor: "grab",
      }}
      {...props}
    />
  );
}

export const ScrollArea = { Root, Viewport, Scrollbar, Thumb };
