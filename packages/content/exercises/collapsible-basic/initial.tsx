import * as React from "react";

/**
 * TODO: Build a headless Collapsible component.
 *
 * Requirements:
 * 1. Collapsible.Root manages open/close state (uncontrolled with defaultOpen)
 * 2. Collapsible.Trigger renders a button with aria-expanded and aria-controls
 * 3. Collapsible.Content renders a panel that shows/hides based on state
 * 4. Trigger toggles the content on click
 * 5. Add data-state="open"/"closed" on all sub-components
 */

interface CollapsibleProps {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface CollapsibleContextValue {
  open: boolean;
  toggle: () => void;
  contentId: string;
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(
  null,
);

function useCollapsibleContext(): CollapsibleContextValue {
  const ctx = React.useContext(CollapsibleContext);
  if (!ctx)
    throw new Error(
      "Collapsible sub-components must be used within Collapsible.Root",
    );
  return ctx;
}

function Root({
  defaultOpen = false,
  onOpenChange,
  children,
  ...props
}: CollapsibleProps & React.ComponentPropsWithoutRef<"div">) {
  // Your implementation here
  return <div {...props}>{children}</div>;
}

function Trigger({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  // Your implementation here
  return <button {...props}>{children}</button>;
}

function Content({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // Your implementation here
  return <div {...props}>{children}</div>;
}

export const Collapsible = { Root, Trigger, Content };
