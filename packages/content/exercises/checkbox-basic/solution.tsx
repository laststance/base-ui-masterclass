import * as React from "react";

type CheckedState = boolean | "indeterminate";

interface CheckboxProps extends Omit<React.ComponentPropsWithoutRef<"button">, "onChange"> {
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  onCheckedChange?: (checked: CheckedState) => void;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * A headless Checkbox component supporting three states: checked,
 * unchecked, and indeterminate.
 *
 * Uses role="checkbox" and aria-checked to communicate state to
 * assistive technology. The indeterminate state uses aria-checked="mixed".
 *
 * @param props - Checkbox props including checked state and change handler
 * @returns An accessible checkbox button element
 *
 * @example
 * // Basic usage
 * <Checkbox defaultChecked={false}>Accept terms</Checkbox>
 *
 * @example
 * // Indeterminate (parent checkbox in a group)
 * <Checkbox checked="indeterminate" onCheckedChange={handleChange}>
 *   Select all
 * </Checkbox>
 */
export function Checkbox({
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  ref,
  children,
  ...props
}: CheckboxProps) {
  // Inline useControllableState
  const isControlled = controlledChecked !== undefined;
  const [internalChecked, setInternalChecked] =
    React.useState<CheckedState>(defaultChecked);
  const checked = isControlled ? controlledChecked : internalChecked;

  const setChecked = React.useCallback(
    (next: CheckedState) => {
      if (!isControlled) {
        setInternalChecked(next);
      }
      onCheckedChange?.(next);
    },
    [isControlled, onCheckedChange],
  );

  const handleClick = () => {
    if (!disabled) {
      // Indeterminate always transitions to checked (true)
      // Checked transitions to unchecked, unchecked to checked
      setChecked(checked === true ? false : true);
    }
  };

  // Map CheckedState to aria-checked value
  const ariaChecked: "true" | "false" | "mixed" =
    checked === "indeterminate" ? "mixed" : checked ? "true" : "false";

  return (
    <button
      {...props}
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={ariaChecked}
      disabled={disabled}
      onClick={handleClick}
      data-checked={checked === true || undefined}
      data-unchecked={checked === false || undefined}
      data-indeterminate={checked === "indeterminate" || undefined}
      data-disabled={disabled || undefined}
    >
      {children}
    </button>
  );
}
