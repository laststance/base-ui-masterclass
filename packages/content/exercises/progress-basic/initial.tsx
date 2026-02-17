import * as React from "react";

/**
 * TODO: Build a headless Progress component.
 *
 * Requirements:
 * 1. Render a container with role="progressbar"
 * 2. Support aria-valuenow, aria-valuemin, aria-valuemax
 * 3. Calculate percentage and expose via --progress-value CSS custom property
 * 4. Add data-state="determinate" when value is provided, "indeterminate" when null
 * 5. Build a compound component with Root and Indicator
 */

interface ProgressProps {
  value?: number | null;
  min?: number;
  max?: number;
}

interface ProgressContextValue {
  value: number | null;
  min: number;
  max: number;
  percentage: number | null;
}

const ProgressContext = React.createContext<ProgressContextValue | null>(null);

function useProgressContext(): ProgressContextValue {
  const ctx = React.useContext(ProgressContext);
  if (!ctx) throw new Error("Progress sub-components must be used within Progress.Root");
  return ctx;
}

function Root({
  value = null,
  min = 0,
  max = 100,
  children,
  ...props
}: ProgressProps & React.ComponentPropsWithoutRef<"div">) {
  // Your implementation here
  return <div {...props}>{children}</div>;
}

function Indicator(props: React.ComponentPropsWithoutRef<"div">) {
  // Your implementation here
  return <div {...props} />;
}

export const Progress = { Root, Indicator };
