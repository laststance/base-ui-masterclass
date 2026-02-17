import * as React from "react";

/**
 * TODO: Build a headless Slider component.
 *
 * Requirements:
 * 1. Slider.Root manages value state with min/max/step constraints and provides context
 * 2. Slider.Track is the visual track container
 * 3. Slider.Range is the filled portion reflecting the current value
 * 4. Slider.Thumb has role="slider" with ARIA value attributes and keyboard navigation
 * 5. ArrowRight/ArrowUp increment by step; ArrowLeft/ArrowDown decrement
 * 6. Home sets to min; End sets to max
 * 7. Pointer events on root for click-to-position and drag behavior
 * 8. Expose CSS custom property --slider-value as percentage
 */

interface SliderProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
}

interface SliderContextValue {
  value: number;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  orientation: "horizontal" | "vertical";
  percentage: number;
  thumbRef: React.RefObject<HTMLDivElement | null>;
  trackRef: React.RefObject<HTMLDivElement | null>;
  updateValue: (next: number) => void;
}

const SliderContext = React.createContext<SliderContextValue | null>(null);

function useSliderContext(): SliderContextValue {
  const ctx = React.useContext(SliderContext);
  if (!ctx)
    throw new Error(
      "Slider sub-components must be used within Slider.Root",
    );
  return ctx;
}

function Root({
  value: controlledValue,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  orientation = "horizontal",
  disabled = false,
  children,
  ...props
}: SliderProps & React.ComponentPropsWithoutRef<"div">) {
  // TODO: Implement the root component
  // 1. Manage value state (controlled & uncontrolled)
  // 2. Calculate percentage: ((value - min) / (max - min)) * 100
  // 3. Create updateValue that clamps and snaps to step
  // 4. Handle onPointerDown and onPointerMove for drag interaction
  // 5. Set --slider-value CSS custom property
  // 6. Provide context to children
  return <div {...props}>{children}</div>;
}

function Track({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // TODO: Implement the track component
  // 1. Attach trackRef from context
  // 2. Set data-orientation
  return <div {...props}>{children}</div>;
}

function Range(props: React.ComponentPropsWithoutRef<"div">) {
  // TODO: Implement the range (fill) component
  // 1. Set width (horizontal) or height (vertical) based on percentage
  return <div {...props} />;
}

function Thumb(props: React.ComponentPropsWithoutRef<"div">) {
  // TODO: Implement the thumb component
  // 1. Set role="slider" with aria-valuenow, aria-valuemin, aria-valuemax
  // 2. Set aria-orientation and tabIndex
  // 3. Handle keyboard navigation (ArrowRight/Left/Up/Down, Home, End)
  // 4. Position via left (horizontal) or bottom (vertical) percentage
  return <div {...props} />;
}

export const Slider = { Root, Track, Range, Thumb };
