import * as React from "react";

/**
 * TODO: Implement a useRovingTabIndex hook for arrow key navigation.
 *
 * Requirements:
 * 1. Track the active index (which item has tabIndex=0)
 * 2. Return getItemProps that provides tabIndex, onKeyDown, onFocus, and ref for each item
 * 3. ArrowRight moves focus to the next item (horizontal orientation)
 * 4. ArrowLeft moves focus to the previous item
 * 5. Focus wraps around (last → first, first → last)
 * 6. Home key moves focus to the first item
 * 7. End key moves focus to the last item
 */

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

  // Your implementation here
  return {
    activeIndex: 0,
    getItemProps: (index: number) => ({
      tabIndex: 0,
      onKeyDown: () => {},
      onFocus: () => {},
      ref: () => {},
    }),
  };
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
