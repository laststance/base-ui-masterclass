import * as React from "react";

/**
 * TODO: Build a headless Accordion component.
 *
 * Requirements:
 * 1. Accordion.Root manages which items are expanded (single-expand mode)
 * 2. Accordion.Item wraps each section with a value identifier
 * 3. Accordion.Trigger renders a button with aria-expanded and aria-controls
 * 4. Accordion.Panel renders a region with role="region" and aria-labelledby
 * 5. In single mode, opening one item closes the previously open item
 * 6. Support keyboard navigation: Enter/Space toggles, ArrowDown/Up moves focus
 */

interface AccordionProps {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

interface AccordionContextValue {
  expandedValue: string | null;
  toggle: (value: string) => void;
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
  // Your implementation here
  return <div {...props}>{children}</div>;
}

function Item({
  value,
  children,
  ...props
}: { value: string } & React.ComponentPropsWithoutRef<"div">) {
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

function Panel({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // Your implementation here
  return <div {...props}>{children}</div>;
}

export const Accordion = { Root, Item, Trigger, Panel };
