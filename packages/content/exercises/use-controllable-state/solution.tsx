import * as React from "react";

interface UseControllableStateOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

/**
 * Manages state that can be either controlled or uncontrolled.
 *
 * When `value` is provided (not undefined), the component is controlled
 * and the parent owns the state. When `value` is undefined, the component
 * manages its own state internally, initialized from `defaultValue`.
 *
 * @param options.value - Controlled value (undefined = uncontrolled mode)
 * @param options.defaultValue - Initial value for uncontrolled mode
 * @param options.onChange - Callback fired when the value changes (both modes)
 * @returns A [value, setValue] tuple identical to React.useState
 *
 * @example
 * // Uncontrolled usage (inside a Switch component):
 * const [checked, setChecked] = useControllableState({
 *   value: undefined,
 *   defaultValue: false,
 *   onChange: (v) => console.log("changed:", v),
 * });
 *
 * @example
 * // Controlled usage:
 * const [checked, setChecked] = useControllableState({
 *   value: props.checked,
 *   defaultValue: false,
 *   onChange: props.onCheckedChange,
 * });
 */
export function useControllableState<T>({
  value: controlledValue,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): [T, (nextValue: T) => void] {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);

  const resolvedValue = isControlled ? controlledValue : internalValue;

  const setValue = React.useCallback(
    (nextValue: T) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onChange?.(nextValue);
    },
    [isControlled, onChange],
  );

  return [resolvedValue, setValue];
}
