import * as React from "react";

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
  const percentage =
    value != null ? Math.round(((value - min) / (max - min)) * 100) : null;

  const ctx = React.useMemo(
    () => ({ value, min, max, percentage }),
    [value, min, max, percentage],
  );

  return (
    <ProgressContext value={ctx}>
      <div
        role="progressbar"
        aria-valuenow={value ?? undefined}
        aria-valuemin={min}
        aria-valuemax={max}
        data-state={value == null ? "indeterminate" : "determinate"}
        style={
          {
            "--progress-value":
              percentage != null ? `${percentage}%` : undefined,
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    </ProgressContext>
  );
}

function Indicator(props: React.ComponentPropsWithoutRef<"div">) {
  const { percentage } = useProgressContext();

  return (
    <div
      data-state={percentage == null ? "indeterminate" : "determinate"}
      style={{ width: percentage != null ? `${percentage}%` : undefined }}
      {...props}
    />
  );
}

export const Progress = { Root, Indicator };
