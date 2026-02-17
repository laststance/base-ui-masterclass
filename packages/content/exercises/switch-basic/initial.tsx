import * as React from "react";

/**
 * TODO: Build a headless Switch component.
 *
 * Requirements:
 * 1. Render a <button> element with role="switch"
 * 2. Support controlled (checked + onCheckedChange) and uncontrolled (defaultChecked) modes
 * 3. Set aria-checked to reflect the current state
 * 4. Toggle on click
 * 5. Toggle on Space and Enter key presses
 * 6. Add data-checked / data-unchecked / data-disabled attributes
 * 7. Do nothing when disabled
 *
 * You may implement useControllableState inline or import it.
 */

interface SwitchProps extends Omit<React.ComponentPropsWithoutRef<"button">, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  ref?: React.Ref<HTMLButtonElement>;
}

export function Switch(props: SwitchProps) {
  // Your implementation here
  return <button>TODO</button>;
}
