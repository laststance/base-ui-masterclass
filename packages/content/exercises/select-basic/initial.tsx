import * as React from "react";

/**
 * TODO: Build a headless Select component with compound components.
 *
 * Requirements:
 * 1. Select.Root manages open state, selected value, and highlighted index
 * 2. Select.Trigger renders a button with role="combobox" and aria-haspopup="listbox"
 * 3. Select.Trigger has aria-expanded and aria-controls pointing to the listbox
 * 4. Select.Value displays the selected option's label or a placeholder
 * 5. Select.Content renders a ul with role="listbox" (only when open)
 * 6. Select.Option renders a li with role="option" and aria-selected
 * 7. DOM focus stays on the trigger — use aria-activedescendant for highlighting
 * 8. ArrowDown/ArrowUp navigate options, Enter/Space selects, Escape closes
 * 9. Clicking an option selects it and closes the popup
 * 10. Focus returns to trigger when popup closes
 */

interface SelectProps {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

interface SelectContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedValue: string;
  selectValue: (value: string) => void;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  options: React.RefObject<{ value: string; label: string; id: string }[]>;
  registerOption: (value: string, label: string, id: string) => void;
  listboxId: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext(): SelectContextValue {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("Select components must be used within Select.Root");
  return ctx;
}

function Root({
  defaultValue = "",
  onValueChange,
  children,
}: SelectProps & { children: React.ReactNode }) {
  // Your implementation here
  return <>{children}</>;
}

function Trigger({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  // Your implementation here
  return <button {...props}>{children}</button>;
}

function Value({ placeholder = "Select..." }: { placeholder?: string }) {
  // Your implementation here
  return <span>{placeholder}</span>;
}

function Content({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"ul">) {
  // Your implementation here
  return null;
}

function Option({
  value,
  children,
  ...props
}: { value: string } & React.ComponentPropsWithoutRef<"li">) {
  // Your implementation here
  return <li {...props}>{children}</li>;
}

export const Select = { Root, Trigger, Value, Content, Option };
