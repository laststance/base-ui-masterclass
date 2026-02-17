import * as React from "react";

/**
 * A headless Select component built with compound components.
 *
 * @example
 * <Select.Root defaultValue="apple" onValueChange={(v) => console.log(v)}>
 *   <Select.Trigger>
 *     <Select.Value placeholder="Pick a fruit" />
 *   </Select.Trigger>
 *   <Select.Content>
 *     <Select.Option value="apple">Apple</Select.Option>
 *     <Select.Option value="banana">Banana</Select.Option>
 *   </Select.Content>
 * </Select.Root>
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
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(defaultValue);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const options = React.useRef<{ value: string; label: string; id: string }[]>([]);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const listboxId = `listbox-${React.useId()}`;

  const selectValue = React.useCallback(
    (val: string) => {
      setSelectedValue(val);
      onValueChange?.(val);
      setIsOpen(false);
      triggerRef.current?.focus();
    },
    [onValueChange],
  );

  const registerOption = React.useCallback(
    (value: string, label: string, id: string) => {
      const exists = options.current.find((o) => o.value === value);
      if (!exists) {
        options.current.push({ value, label, id });
      }
    },
    [],
  );

  const ctx = React.useMemo(
    () => ({
      isOpen,
      setIsOpen,
      selectedValue,
      selectValue,
      highlightedIndex,
      setHighlightedIndex,
      options,
      registerOption,
      listboxId,
      triggerRef,
    }),
    [isOpen, selectedValue, selectValue, highlightedIndex, registerOption, listboxId],
  );

  return <SelectContext value={ctx}>{children}</SelectContext>;
}

function Trigger({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  const {
    isOpen,
    setIsOpen,
    highlightedIndex,
    setHighlightedIndex,
    options,
    selectValue,
    listboxId,
    triggerRef,
  } = useSelectContext();

  const activeDescendant =
    highlightedIndex >= 0 ? options.current[highlightedIndex]?.id : undefined;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      switch (e.key) {
        case "Enter":
        case " ":
        case "ArrowDown": {
          e.preventDefault();
          setIsOpen(true);
          setHighlightedIndex(0);
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          setIsOpen(true);
          setHighlightedIndex(options.current.length - 1);
          break;
        }
      }
    } else {
      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          setHighlightedIndex(
            Math.min(highlightedIndex + 1, options.current.length - 1),
          );
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          setHighlightedIndex(Math.max(highlightedIndex - 1, 0));
          break;
        }
        case "Home": {
          e.preventDefault();
          setHighlightedIndex(0);
          break;
        }
        case "End": {
          e.preventDefault();
          setHighlightedIndex(options.current.length - 1);
          break;
        }
        case "Enter":
        case " ": {
          e.preventDefault();
          if (highlightedIndex >= 0) {
            selectValue(options.current[highlightedIndex].value);
          }
          break;
        }
        case "Escape": {
          e.preventDefault();
          setIsOpen(false);
          break;
        }
      }
    }
  };

  return (
    <button
      ref={triggerRef}
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-controls={listboxId}
      aria-activedescendant={isOpen ? activeDescendant : undefined}
      onClick={() => {
        if (isOpen) {
          setIsOpen(false);
        } else {
          setIsOpen(true);
          setHighlightedIndex(0);
        }
      }}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </button>
  );
}

function Value({ placeholder = "Select..." }: { placeholder?: string }) {
  const { selectedValue, options } = useSelectContext();
  const selected = options.current.find((o) => o.value === selectedValue);
  return <span>{selected ? selected.label : placeholder}</span>;
}

function Content({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"ul">) {
  const { isOpen, listboxId } = useSelectContext();

  if (!isOpen) return null;

  return (
    <ul role="listbox" id={listboxId} {...props}>
      {children}
    </ul>
  );
}

function Option({
  value,
  children,
  ...props
}: { value: string } & React.ComponentPropsWithoutRef<"li">) {
  const {
    selectedValue,
    selectValue,
    highlightedIndex,
    setHighlightedIndex,
    options,
    registerOption,
  } = useSelectContext();

  const optionId = `option-${React.useId()}`;
  const label = typeof children === "string" ? children : value;

  React.useEffect(() => {
    registerOption(value, label, optionId);
  }, [value, label, optionId, registerOption]);

  const index = options.current.findIndex((o) => o.value === value);
  const isSelected = selectedValue === value;
  const isHighlighted = highlightedIndex === index;

  return (
    <li
      role="option"
      id={optionId}
      aria-selected={isSelected}
      data-highlighted={isHighlighted || undefined}
      data-state={isSelected ? "selected" : undefined}
      onClick={() => selectValue(value)}
      onPointerMove={() => setHighlightedIndex(index)}
      {...props}
    >
      {children}
    </li>
  );
}

export const Select = { Root, Trigger, Value, Content, Option };
