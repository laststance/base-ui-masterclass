import * as React from "react";

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
  const [open, setOpen] = React.useState(defaultOpen);
  const contentId = React.useId();

  const toggle = React.useCallback(() => {
    const next = !open;
    setOpen(next);
    onOpenChange?.(next);
  }, [open, onOpenChange]);

  const ctx = React.useMemo(
    () => ({ open, toggle, contentId }),
    [open, toggle, contentId],
  );

  return (
    <CollapsibleContext value={ctx}>
      <div data-state={open ? "open" : "closed"} {...props}>
        {children}
      </div>
    </CollapsibleContext>
  );
}

function Trigger({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  const { open, toggle, contentId } = useCollapsibleContext();

  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={contentId}
      data-state={open ? "open" : "closed"}
      onClick={toggle}
      {...props}
    >
      {children}
    </button>
  );
}

function Content({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { open, contentId } = useCollapsibleContext();

  return (
    <div
      id={contentId}
      role="region"
      data-state={open ? "open" : "closed"}
      hidden={!open}
      {...props}
    >
      {children}
    </div>
  );
}

export const Collapsible = { Root, Trigger, Content };
