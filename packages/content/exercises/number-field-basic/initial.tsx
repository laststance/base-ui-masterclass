import * as React from "react";

/**
 * TODO: Build a headless NumberField component.
 *
 * Requirements:
 * 1. NumberField.Root manages the numeric value state with min/max/step constraints
 * 2. NumberField.Input renders an input with role="spinbutton" and ARIA value attributes
 * 3. NumberField.Increment renders a button that increases the value by step
 * 4. NumberField.Decrement renders a button that decreases the value by step
 * 5. ArrowUp/ArrowDown on the input increment/decrement the value
 * 6. Home/End keys set the value to min/max
 * 7. Increment button is disabled when value >= max; Decrement when value <= min
 * 8. Support controlled (value) and uncontrolled (defaultValue) modes
 */

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
  // TODO: Implement the root component
  // 1. Manage internal value state (support controlled & uncontrolled)
  // 2. Create increment/decrement/setValue functions that clamp to min/max
  // 3. Provide context to children
  return <div {...props}>{children}</div>;
}

function Input(props: React.ComponentPropsWithoutRef<"input">) {
  // TODO: Implement the input component
  // 1. Add role="spinbutton" with aria-valuenow, aria-valuemin, aria-valuemax
  // 2. Handle ArrowUp/ArrowDown for increment/decrement
  // 3. Handle Home/End for min/max
  // 4. Handle text input changes (parse numeric value)
  return <input {...props} />;
}

function Increment(props: React.ComponentPropsWithoutRef<"button">) {
  // TODO: Implement increment button
  // 1. Call increment on click
  // 2. Set aria-label="Increment"
  // 3. Disable when value >= max or when disabled
  // 4. Set tabIndex={-1} (keyboard handled by input)
  return <button {...props} />;
}

function Decrement(props: React.ComponentPropsWithoutRef<"button">) {
  // TODO: Implement decrement button
  // 1. Call decrement on click
  // 2. Set aria-label="Decrement"
  // 3. Disable when value <= min or when disabled
  // 4. Set tabIndex={-1} (keyboard handled by input)
  return <button {...props} />;
}

export const NumberField = { Root, Input, Increment, Decrement };
