import type { ReactNode } from "react";

type CalloutVariant = "info" | "warning" | "error" | "tip";

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
}

const variantStyles: Record<
  CalloutVariant,
  { border: string; bg: string; icon: string; title: string }
> = {
  info: {
    border: "border-info/30",
    bg: "bg-info/5",
    icon: "text-info",
    title: "text-info",
  },
  warning: {
    border: "border-warning/30",
    bg: "bg-warning/5",
    icon: "text-warning",
    title: "text-warning",
  },
  error: {
    border: "border-error/30",
    bg: "bg-error/5",
    icon: "text-error",
    title: "text-error",
  },
  tip: {
    border: "border-accent/30",
    bg: "bg-accent/5",
    icon: "text-accent",
    title: "text-accent",
  },
};

const variantIcons: Record<CalloutVariant, string> = {
  info: "i",
  warning: "!",
  error: "\u00d7",
  tip: "\u2713",
};

/**
 * Callout component for MDX content.
 * Renders styled info/warning/error/tip blocks within lessons.
 *
 * @param variant - Visual style: "info" | "warning" | "error" | "tip"
 * @param title - Optional heading for the callout
 * @param children - Content to display inside the callout
 *
 * @example
 * <Callout variant="tip" title="Pro Tip">
 *   Use `useId()` for generating unique ARIA IDs.
 * </Callout>
 */
export function Callout({ variant = "info", title, children }: CalloutProps) {
  const styles = variantStyles[variant];
  const icon = variantIcons[variant];

  return (
    <aside
      className={`my-6 rounded-lg border ${styles.border} ${styles.bg} p-4`}
      role="note"
    >
      <div className="flex gap-3">
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${styles.border} ${styles.icon} text-xs font-bold`}
          aria-hidden="true"
        >
          {icon}
        </span>
        <div className="min-w-0">
          {title && (
            <p className={`mb-1 text-sm font-semibold ${styles.title}`}>
              {title}
            </p>
          )}
          <div className="text-sm text-text-secondary leading-relaxed [&>p]:m-0">
            {children}
          </div>
        </div>
      </div>
    </aside>
  );
}
