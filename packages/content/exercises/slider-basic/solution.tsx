import * as React from "react";

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
    throw new Error("Slider sub-components must be used within Slider.Root");
  return ctx;
}

/**
 * Clamps a value within min/max bounds.
 * @param value - The value to clamp.
 * @param min - Lower bound.
 * @param max - Upper bound.
 * @returns The clamped value.
 * @example
 * clamp(150, 0, 100) // => 100
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
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
  const [internalValue, setInternalValue] = React.useState(
    controlledValue ?? defaultValue,
  );
  const value = controlledValue ?? internalValue;
  const trackRef = React.useRef<HTMLDivElement>(null);
  const thumbRef = React.useRef<HTMLDivElement>(null);
  const percentage = ((value - min) / (max - min)) * 100;

  const updateValue = React.useCallback(
    (next: number) => {
      const clamped = clamp(next, min, max);
      const stepped = Math.round((clamped - min) / step) * step + min;
      const final = clamp(stepped, min, max);
      if (controlledValue === undefined) setInternalValue(final);
      onValueChange?.(final);
    },
    [min, max, step, controlledValue, onValueChange],
  );

  const getValueFromPointer = React.useCallback(
    (clientX: number, clientY: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const percent =
        orientation === "horizontal"
          ? (clientX - rect.left) / rect.width
          : (rect.bottom - clientY) / rect.height;
      const raw = min + percent * (max - min);
      updateValue(raw);
    },
    [min, max, orientation, updateValue],
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    getValueFromPointer(e.clientX, e.clientY);
    thumbRef.current?.focus();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    getValueFromPointer(e.clientX, e.clientY);
  };

  const ctx = React.useMemo(
    () => ({
      value,
      min,
      max,
      step,
      disabled,
      orientation,
      percentage,
      thumbRef,
      trackRef,
      updateValue,
    }),
    [value, min, max, step, disabled, orientation, percentage, updateValue],
  );

  return (
    <SliderContext value={ctx}>
      <div
        data-orientation={orientation}
        data-disabled={disabled || undefined}
        style={
          {
            "--slider-value": `${percentage}%`,
            "--slider-thumb-position": `${percentage}%`,
          } as React.CSSProperties
        }
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        {...props}
      >
        {children}
      </div>
    </SliderContext>
  );
}

function Track({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { trackRef, orientation } = useSliderContext();

  return (
    <div ref={trackRef} data-orientation={orientation} {...props}>
      {children}
    </div>
  );
}

function Range(props: React.ComponentPropsWithoutRef<"div">) {
  const { percentage, orientation } = useSliderContext();

  const style =
    orientation === "horizontal"
      ? { width: `${percentage}%` }
      : { height: `${percentage}%` };

  return <div data-orientation={orientation} style={style} {...props} />;
}

function Thumb(props: React.ComponentPropsWithoutRef<"div">) {
  const {
    value,
    min,
    max,
    step,
    disabled,
    orientation,
    percentage,
    thumbRef,
    updateValue,
  } = useSliderContext();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault();
        updateValue(value + step);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault();
        updateValue(value - step);
        break;
      case "Home":
        e.preventDefault();
        updateValue(min);
        break;
      case "End":
        e.preventDefault();
        updateValue(max);
        break;
      case "PageUp":
        e.preventDefault();
        updateValue(value + step * 10);
        break;
      case "PageDown":
        e.preventDefault();
        updateValue(value - step * 10);
        break;
    }
  };

  const positionStyle =
    orientation === "horizontal"
      ? { left: `${percentage}%` }
      : { bottom: `${percentage}%` };

  return (
    <div
      ref={thumbRef}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-orientation={orientation}
      aria-disabled={disabled || undefined}
      data-disabled={disabled || undefined}
      style={positionStyle}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}

export const Slider = { Root, Track, Range, Thumb };
