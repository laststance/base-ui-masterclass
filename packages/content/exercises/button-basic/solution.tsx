import * as React from "react";

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  render?: React.ReactElement;
}

export function Button({ render, disabled, ...props }: ButtonProps) {
  const elementProps = {
    ...props,
    disabled,
    "data-disabled": disabled || undefined,
  };

  if (render) {
    return React.cloneElement(render, elementProps);
  }

  return <button {...elementProps} />;
}
