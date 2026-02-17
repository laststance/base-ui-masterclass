import * as React from "react";

/**
 * TODO: Implement the useControllableState hook.
 *
 * This hook manages state that can be either controlled or uncontrolled:
 * - When `value` is provided (not undefined), the component is controlled.
 * - When `value` is undefined, the component manages internal state
 *   initialized from `defaultValue`.
 * - `onChange` is called in both modes when the value changes.
 *
 * Requirements:
 * 1. Return a [value, setValue] tuple like React.useState
 * 2. Use `value` prop when defined (controlled mode)
 * 3. Use internal state from `defaultValue` when `value` is undefined (uncontrolled)
 * 4. Call `onChange` in both modes
 * 5. In controlled mode, do NOT update internal state
 */

interface UseControllableStateOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

export function useControllableState<T>(
  options: UseControllableStateOptions<T>,
): [T, (nextValue: T) => void] {
  // Your implementation here
  const [state] = React.useState(options.defaultValue);
  return [state, () => {}];
}
