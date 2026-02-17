import * as React from "react";

interface SwitchProps extends Omit<React.ComponentPropsWithoutRef<"button">, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * A headless Switch component that renders an accessible toggle.
 *
 * Uses role="switch" and aria-checked to communicate state to
 * assistive technology. Supports both controlled and uncontrolled modes.
 *
 * @param props - Switch props including checked state and change handler
 * @returns An accessible switch button element
 *
 * @example
 * // Uncontrolled
 * <Switch defaultChecked={false}>Dark mode</Switch>
 *
 * @example
 * // Controlled
 * <Switch checked={isDark} onCheckedChange={setIsDark}>Dark mode</Switch>
 */
export function Switch({
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  ref,
  onKeyDown,
  children,
  ...props
}: SwitchProps) {
  // Inline useControllableState for this exercise
  const isControlled = controlledChecked !== undefined;
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const checked = isControlled ? controlledChecked : internalChecked;

  const setChecked = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalChecked(next);
      }
      onCheckedChange?.(next);
    },
    [isControlled, onCheckedChange],
  );

  const toggle = () => {
    if (!disabled) {
      setChecked(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle();
    }
    onKeyDown?.(e);
  };

  return (
    <button
      {...props}
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      data-checked={checked || undefined}
      data-unchecked={!checked || undefined}
      data-disabled={disabled || undefined}
    >
      {children}
    </button>
  );
}
