import * as React from "react";

/**
 * TODO: Build a headless Input component.
 *
 * Requirements:
 * 1. Render a native <input> element by default
 * 2. Forward all native input props (type, placeholder, disabled, etc.)
 * 3. Support a `render` prop for custom element rendering
 * 4. Add `data-disabled` attribute when disabled
 * 5. Add `data-invalid` attribute when aria-invalid is set
 * 6. Track focus state and add `data-focused` attribute
 */

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  render?: React.ReactElement;
  ref?: React.Ref<HTMLInputElement>;
}

export function Input(props: InputProps) {
  // Your implementation here
  return <input />;
}
