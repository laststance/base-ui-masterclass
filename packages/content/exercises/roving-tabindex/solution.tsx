import * as React from "react";

interface UseRovingTabIndexOptions {
  orientation?: "horizontal" | "vertical";
  wrap?: boolean;
  initialIndex?: number;
}

interface UseRovingTabIndexReturn {
  activeIndex: number;
  getItemProps: (index: number) => {
    tabIndex: number;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onFocus: () => void;
    ref: (el: HTMLElement | null) => void;
  };
}

export function useRovingTabIndex(
  options: UseRovingTabIndexOptions = {},
): UseRovingTabIndexReturn {
  const { orientation = "horizontal", wrap = true, initialIndex = 0 } = options;

  const [activeIndex, setActiveIndex] = React.useState(initialIndex);
  const itemsRef = React.useRef<(HTMLElement | null)[]>([]);

  const getNextIndex = React.useCallback(
    (current: number, direction: 1 | -1): number => {
      const count = itemsRef.current.length;
      if (count === 0) return current;

      let next = current + direction;

      if (wrap) {
        next = ((next % count) + count) % count;
      } else {
        next = Math.max(0, Math.min(next, count - 1));
      }

      return next;
    },
    [wrap],
  );

  const moveFocus = React.useCallback((nextIndex: number) => {
    setActiveIndex(nextIndex);
    itemsRef.current[nextIndex]?.focus();
  }, []);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      const forwardKeys =
        orientation === "vertical"
          ? ["ArrowDown"]
          : orientation === "horizontal"
            ? ["ArrowRight"]
            : ["ArrowRight", "ArrowDown"];

      const backwardKeys =
        orientation === "vertical"
          ? ["ArrowUp"]
          : orientation === "horizontal"
            ? ["ArrowLeft"]
            : ["ArrowLeft", "ArrowUp"];

      if (forwardKeys.includes(event.key)) {
        event.preventDefault();
        moveFocus(getNextIndex(activeIndex, 1));
      } else if (backwardKeys.includes(event.key)) {
        event.preventDefault();
        moveFocus(getNextIndex(activeIndex, -1));
      } else if (event.key === "Home") {
        event.preventDefault();
        moveFocus(0);
      } else if (event.key === "End") {
        event.preventDefault();
        moveFocus(itemsRef.current.length - 1);
      }
    },
    [orientation, activeIndex, getNextIndex, moveFocus],
  );

  const getItemProps = React.useCallback(
    (index: number) => ({
      tabIndex: index === activeIndex ? 0 : -1,
      onKeyDown: handleKeyDown,
      onFocus: () => setActiveIndex(index),
      ref: (el: HTMLElement | null) => {
        itemsRef.current[index] = el;
      },
    }),
    [activeIndex, handleKeyDown],
  );

  return { activeIndex, getItemProps };
}

/**
 * Demo component that uses the useRovingTabIndex hook.
 * This renders a toolbar with buttons for testing.
 */
export function ToolbarDemo({ items }: { items: string[] }) {
  const { getItemProps } = useRovingTabIndex({ orientation: "horizontal" });

  return (
    <div role="toolbar" aria-label="Demo toolbar">
      {items.map((label, index) => (
        <button key={label} {...getItemProps(index)}>
          {label}
        </button>
      ))}
    </div>
  );
}
