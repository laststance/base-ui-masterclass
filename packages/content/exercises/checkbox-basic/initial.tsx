import * as React from "react";

/**
 * TODO: Build a headless Checkbox component.
 *
 * Requirements:
 * 1. Render a <button> element with role="checkbox"
 * 2. Support three states: checked (true), unchecked (false), indeterminate ("indeterminate")
 * 3. Set aria-checked to "true", "false", or "mixed" accordingly
 * 4. Toggle between checked and unchecked on click (indeterminate always becomes checked)
 * 5. Support controlled and uncontrolled modes
 * 6. Add data-checked / data-unchecked / data-indeterminate / data-disabled attributes
 * 7. Do nothing when disabled
 */

type CheckedState = boolean | "indeterminate";

interface CheckboxProps extends Omit<React.ComponentPropsWithoutRef<"button">, "onChange"> {
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  onCheckedChange?: (checked: CheckedState) => void;
  ref?: React.Ref<HTMLButtonElement>;
}

export function Checkbox(props: CheckboxProps) {
  // Your implementation here
  return <button>TODO</button>;
}
