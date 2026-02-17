import * as React from "react";

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
  if (!ctx)
    throw new Error("Tabs sub-components must be used within Tabs.Root");
  return ctx;
}

function Root({
  defaultValue,
  onValueChange,
  children,
  ...props
}: TabsProps & React.ComponentPropsWithoutRef<"div">) {
  const [selectedValue, setSelectedValue] = React.useState(defaultValue);
  const tabElements = React.useRef(new Map<string, HTMLElement>());

  const selectTab = React.useCallback(
    (value: string) => {
      setSelectedValue(value);
      onValueChange?.(value);
    },
    [onValueChange],
  );

  const ctx = React.useMemo(
    () => ({ selectedValue, selectTab, tabElements }),
    [selectedValue, selectTab],
  );

  return (
    <TabsContext value={ctx}>
      <div {...props}>{children}</div>
    </TabsContext>
  );
}

function List({ children, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div role="tablist" {...props}>
      {children}
    </div>
  );
}

function Tab({
  value,
  children,
  ...props
}: { value: string } & React.ComponentPropsWithoutRef<"button">) {
  const { selectedValue, selectTab, tabElements } = useTabsContext();
  const isSelected = selectedValue === value;
  const tabId = `tab-${React.useId()}`;
  const panelId = `panel-${value}`;

  const ref = React.useCallback(
    (el: HTMLElement | null) => {
      if (el) {
        tabElements.current.set(value, el);
      } else {
        tabElements.current.delete(value);
      }
    },
    [value, tabElements],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const tabs = Array.from(tabElements.current.entries());
    const currentIdx = tabs.findIndex(([v]) => v === value);
    const count = tabs.length;

    let nextIdx: number | null = null;

    switch (e.key) {
      case "ArrowRight": {
        e.preventDefault();
        nextIdx = (currentIdx + 1) % count;
        break;
      }
      case "ArrowLeft": {
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
      const [nextValue, nextEl] = tabs[nextIdx];
      nextEl.focus();
      selectTab(nextValue); // Automatic activation
    }
  };

  return (
    <button
      role="tab"
      type="button"
      id={tabId}
      ref={ref}
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      data-state={isSelected ? "active" : "inactive"}
      onClick={() => selectTab(value)}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </button>
  );
}

function Panel({
  value,
  children,
  ...props
}: { value: string } & React.ComponentPropsWithoutRef<"div">) {
  const { selectedValue } = useTabsContext();
  const isSelected = selectedValue === value;
  const panelId = `panel-${value}`;

  if (!isSelected) return null;

  return (
    <div
      role="tabpanel"
      id={panelId}
      data-state={isSelected ? "active" : "inactive"}
      tabIndex={0}
      {...props}
    >
      {children}
    </div>
  );
}

export const Tabs = { Root, List, Tab, Panel };
