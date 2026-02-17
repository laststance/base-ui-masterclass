import * as React from "react";

/**
 * TODO: Build a headless Tabs component with compound components.
 *
 * Requirements:
 * 1. Tabs.Root manages selected tab state (uncontrolled with defaultValue)
 * 2. Tabs.List renders a container with role="tablist"
 * 3. Tabs.Tab renders a button with role="tab" and aria-selected
 * 4. Tabs.Panel renders a div with role="tabpanel"
 * 5. Only the selected panel is visible (lazy rendering)
 * 6. Roving tabindex: selected tab has tabIndex=0, others tabIndex=-1
 * 7. Arrow keys move focus between tabs (automatic activation)
 * 8. Home/End keys jump to first/last tab
 */

interface TabsProps {
  defaultValue: string;
  onValueChange?: (value: string) => void;
}

interface TabsContextValue {
  selectedValue: string;
  selectTab: (value: string) => void;
  tabElements: React.RefObject<Map<string, HTMLElement>>;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext(): TabsContextValue {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs sub-components must be used within Tabs.Root");
  return ctx;
}

function Root({
  defaultValue,
  onValueChange,
  children,
  ...props
}: TabsProps & React.ComponentPropsWithoutRef<"div">) {
  // Your implementation here
  return <div {...props}>{children}</div>;
}

function List({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // Your implementation here
  return <div {...props}>{children}</div>;
}

function Tab({
  value,
  children,
  ...props
}: { value: string } & React.ComponentPropsWithoutRef<"button">) {
  // Your implementation here
  return <button {...props}>{children}</button>;
}

function Panel({
  value,
  children,
  ...props
}: { value: string } & React.ComponentPropsWithoutRef<"div">) {
  // Your implementation here
  return <div {...props}>{children}</div>;
}

export const Tabs = { Root, List, Tab, Panel };
