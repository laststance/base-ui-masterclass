import * as React from "react";

interface AccordionProps {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

interface AccordionContextValue {
  expandedValue: string | null;
  toggle: (value: string) => void;
  triggerRefs: React.RefObject<Map<string, HTMLButtonElement>>;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordionContext(): AccordionContextValue {
  const ctx = React.useContext(AccordionContext);
  if (!ctx)
    throw new Error(
      "Accordion sub-components must be used within Accordion.Root",
    );
  return ctx;
}

interface AccordionItemContextValue {
  value: string;
  open: boolean;
  triggerId: string;
  panelId: string;
}

const AccordionItemContext =
  React.createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext(): AccordionItemContextValue {
  const ctx = React.useContext(AccordionItemContext);
  if (!ctx)
    throw new Error(
      "Accordion.Trigger/Panel must be used within Accordion.Item",
    );
  return ctx;
}

function Root({
  defaultValue,
  onValueChange,
  children,
  ...props
}: AccordionProps & React.ComponentPropsWithoutRef<"div">) {
  const [expandedValue, setExpandedValue] = React.useState<string | null>(
    defaultValue ?? null,
  );
  const triggerRefs = React.useRef(new Map<string, HTMLButtonElement>());

  const toggle = React.useCallback(
    (value: string) => {
      const next = expandedValue === value ? null : value;
      setExpandedValue(next);
      onValueChange?.(next ?? "");
    },
    [expandedValue, onValueChange],
  );

  const ctx = React.useMemo(
    () => ({ expandedValue, toggle, triggerRefs }),
    [expandedValue, toggle],
  );

  return (
    <AccordionContext value={ctx}>
      <div data-orientation="vertical" {...props}>
        {children}
      </div>
    </AccordionContext>
  );
}

function Item({
  value,
  children,
  ...props
}: { value: string } & React.ComponentPropsWithoutRef<"div">) {
  const { expandedValue } = useAccordionContext();
  const open = expandedValue === value;
  const id = React.useId();
  const triggerId = `${id}-trigger`;
  const panelId = `${id}-panel`;

  const ctx = React.useMemo(
    () => ({ value, open, triggerId, panelId }),
    [value, open, triggerId, panelId],
  );

  return (
    <AccordionItemContext value={ctx}>
      <div data-state={open ? "open" : "closed"} {...props}>
        {children}
      </div>
    </AccordionItemContext>
  );
}

function Trigger({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  const { toggle, triggerRefs } = useAccordionContext();
  const { value, open, triggerId, panelId } = useAccordionItemContext();

  const ref = React.useCallback(
    (el: HTMLButtonElement | null) => {
      if (el) {
        triggerRefs.current.set(value, el);
      } else {
        triggerRefs.current.delete(value);
      }
    },
    [value, triggerRefs],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const triggers = Array.from(triggerRefs.current.entries());
    const currentIdx = triggers.findIndex(([v]) => v === value);
    const count = triggers.length;

    let nextIdx: number | null = null;

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        nextIdx = (currentIdx + 1) % count;
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        nextIdx = (currentIdx - 1 + count) % count;
        break;
      }
      case "Home": {
        e.preventDefault();
        nextIdx = 0;
        break;
      }
      case "End": {
        e.preventDefault();
        nextIdx = count - 1;
        break;
      }
    }

    if (nextIdx !== null) {
      const [, nextEl] = triggers[nextIdx];
      nextEl.focus();
    }
  };

  return (
    <h3 style={{ margin: 0 }}>
      <button
        type="button"
        ref={ref}
        id={triggerId}
        aria-expanded={open}
        aria-controls={panelId}
        data-state={open ? "open" : "closed"}
        onClick={() => toggle(value)}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </button>
    </h3>
  );
}

function Panel({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { open, triggerId, panelId } = useAccordionItemContext();

  return (
    <div
      id={panelId}
      role="region"
      aria-labelledby={triggerId}
      data-state={open ? "open" : "closed"}
      hidden={!open}
      {...props}
    >
      {children}
    </div>
  );
}

export const Accordion = { Root, Item, Trigger, Panel };
