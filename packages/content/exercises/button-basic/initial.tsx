import * as React from "react";

/**
 * TODO: Build a headless Button component.
 *
 * Requirements:
 * 1. Render a <button> element by default
 * 2. Support a `render` prop for custom element rendering
 * 3. Forward all native button props (onClick, disabled, type, etc.)
 * 4. Add `data-disabled` attribute when disabled
 */

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  render?: React.ReactElement;
}

export function Button(props: ButtonProps) {
  // Your implementation here
  return <button>TODO</button>;
}
