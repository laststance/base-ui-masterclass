import * as React from "react";

interface NumberFieldProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

interface NumberFieldContextValue {
  value: number;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  increment: () => void;
  decrement: () => void;
  setValue: (v: number) => void;
}

const NumberFieldContext =
  React.createContext<NumberFieldContextValue | null>(null);

function useNumberFieldContext(): NumberFieldContextValue {
  const ctx = React.useContext(NumberFieldContext);
  if (!ctx)
    throw new Error(
      "NumberField sub-components must be used within NumberField.Root",
    );
  return ctx;
}

/**
 * Clamps a numeric value within the specified bounds.
 * @param value - The value to clamp.
 * @param min - The lower bound.
 * @param max - The upper bound.
 * @returns The clamped value.
 * @example
 * clamp(150, 0, 100) // => 100
 * clamp(-5, 0, 100)  // => 0
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function Root({
  value: controlledValue,
  defaultValue = 0,
  onValueChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  disabled = false,
  children,
  ...props
}: NumberFieldProps & React.ComponentPropsWithoutRef<"div">) {
  const [internalValue, setInternalValue] = React.useState(
    controlledValue ?? defaultValue,
  );
  const value = controlledValue ?? internalValue;

  const updateValue = React.useCallback(
    (next: number) => {
      const clamped = clamp(next, min, max);
      if (controlledValue === undefined) setInternalValue(clamped);
      onValueChange?.(clamped);
    },
    [min, max, controlledValue, onValueChange],
  );

  const increment = React.useCallback(
    () => updateValue(value + step),
    [value, step, updateValue],
  );

  const decrement = React.useCallback(
    () => updateValue(value - step),
    [value, step, updateValue],
  );

  const ctx = React.useMemo(
    () => ({
      value,
      min,
      max,
      step,
      disabled,
      increment,
      decrement,
      setValue: updateValue,
    }),
    [value, min, max, step, disabled, increment, decrement, updateValue],
  );

  return (
    <NumberFieldContext value={ctx}>
      <div role="group" data-disabled={disabled || undefined} {...props}>
        {children}
      </div>
    </NumberFieldContext>
  );
}

function Input(props: React.ComponentPropsWithoutRef<"input">) {
  const { value, min, max, step, disabled, increment, decrement, setValue } =
    useNumberFieldContext();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        increment();
        break;
      case "ArrowDown":
        e.preventDefault();
        decrement();
        break;
      case "Home":
        e.preventDefault();
        if (min !== -Infinity) setValue(min);
        break;
      case "End":
        e.preventDefault();
        if (max !== Infinity) setValue(max);
        break;
      case "PageUp":
        e.preventDefault();
        setValue(value + step * 10);
        break;
      case "PageDown":
        e.preventDefault();
        setValue(value - step * 10);
        break;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value);
    if (!Number.isNaN(parsed)) setValue(parsed);
  };

  return (
    <input
      role="spinbutton"
      type="text"
      inputMode="numeric"
      aria-valuenow={value}
      aria-valuemin={min !== -Infinity ? min : undefined}
      aria-valuemax={max !== Infinity ? max : undefined}
      value={value}
      disabled={disabled}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}

function Increment(props: React.ComponentPropsWithoutRef<"button">) {
  const { increment, disabled, value, max } = useNumberFieldContext();
  const atMax = value >= max;

  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label="Increment"
      disabled={disabled || atMax}
      onClick={increment}
      {...props}
    />
  );
}

function Decrement(props: React.ComponentPropsWithoutRef<"button">) {
  const { decrement, disabled, value, min } = useNumberFieldContext();
  const atMin = value <= min;

  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label="Decrement"
      disabled={disabled || atMin}
      onClick={decrement}
      {...props}
    />
  );
}

export const NumberField = { Root, Input, Increment, Decrement };
