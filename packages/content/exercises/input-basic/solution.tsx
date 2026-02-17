import * as React from "react";

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  render?: React.ReactElement;
  ref?: React.Ref<HTMLInputElement>;
}

/**
 * A headless Input component that exposes state through data attributes.
 *
 * Supports both controlled (`value` + `onChange`) and uncontrolled
 * (`defaultValue`) modes. Tracks focus state internally and mirrors
 * `aria-invalid` into a `data-invalid` styling hook.
 *
 * @param props - Native input props plus optional render prop
 * @returns A styled-agnostic input element
 *
 * @example
 * <Input placeholder="Email" aria-invalid={!isValid} />
 * <Input render={<textarea />} placeholder="Message" />
 */
export function Input({
  render,
  disabled,
  ref,
  onFocus,
  onBlur,
  "aria-invalid": ariaInvalid,
  ...props
}: InputProps) {
  const [focused, setFocused] = React.useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  const dataAttributes = {
    "data-disabled": disabled || undefined,
    "data-focused": focused || undefined,
    "data-invalid": ariaInvalid || undefined,
  };

  const elementProps = {
    ...props,
    ref,
    disabled,
    "aria-invalid": ariaInvalid,
    onFocus: handleFocus,
    onBlur: handleBlur,
    ...dataAttributes,
  };

  if (render) {
    return React.cloneElement(render, elementProps);
  }

  return <input {...elementProps} />;
}
