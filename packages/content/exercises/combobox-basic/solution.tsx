import * as React from "react";

/**
 * A headless Combobox/Autocomplete component built with compound components.
 *
 * Combines a text input with a filterable popup listbox.
 * DOM focus stays on the input while aria-activedescendant
 * communicates the highlighted option to screen readers.
 *
 * @example
 * <Combobox.Root onValueChange={(v) => console.log(v)}>
 *   <Combobox.Input placeholder="Search fruits..." />
 *   <Combobox.Content>
 *     <Combobox.Option value="apple">Apple</Combobox.Option>
 *     <Combobox.Option value="banana">Banana</Combobox.Option>
 *     <Combobox.Empty>No fruits found</Combobox.Empty>
 *   </Combobox.Content>
 * </Combobox.Root>
 */

interface ComboboxProps {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

interface ComboboxContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  selectedValue: string;
  selectValue: (value: string, label: string) => void;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  filteredOptions: { value: string; label: string; id: string }[];
  registerOption: (value: string, label: string, id: string) => void;
  listboxId: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null);

function useComboboxContext(): ComboboxContextValue {
  const ctx = React.useContext(ComboboxContext);
  if (!ctx) throw new Error("Combobox components must be used within Combobox.Root");
  return ctx;
}

function Root({
  defaultValue = "",
  onValueChange,
  children,
}: ComboboxProps & { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [selectedValue, setSelectedValue] = React.useState(defaultValue);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const allOptions = React.useRef<{ value: string; label: string; id: string }[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listboxId = `combobox-listbox-${React.useId()}`;

  const filteredOptions = React.useMemo(() => {
    if (!inputValue) return allOptions.current;
    return allOptions.current.filter((opt) =>
      opt.label.toLowerCase().includes(inputValue.toLowerCase()),
    );
  }, [inputValue]);

  const selectValue = React.useCallback(
    (val: string, label: string) => {
      setSelectedValue(val);
      setInputValue(label);
      setIsOpen(false);
      setHighlightedIndex(-1);
      onValueChange?.(val);
      inputRef.current?.focus();
    },
    [onValueChange],
  );

  const registerOption = React.useCallback(
    (value: string, label: string, id: string) => {
      const exists = allOptions.current.find((o) => o.value === value);
      if (!exists) {
        allOptions.current.push({ value, label, id });
      }
    },
    [],
  );

  const ctx = React.useMemo(
    () => ({
      isOpen,
      setIsOpen,
      inputValue,
      setInputValue,
      selectedValue,
      selectValue,
      highlightedIndex,
      setHighlightedIndex,
      filteredOptions,
      registerOption,
      listboxId,
      inputRef,
    }),
    [
      isOpen, inputValue, selectedValue, selectValue,
      highlightedIndex, filteredOptions, registerOption, listboxId,
    ],
  );

  return <ComboboxContext value={ctx}>{children}</ComboboxContext>;
}

function Input(props: React.ComponentPropsWithoutRef<"input">) {
  const {
    isOpen,
    setIsOpen,
    inputValue,
    setInputValue,
    highlightedIndex,
    setHighlightedIndex,
    filteredOptions,
    selectValue,
    listboxId,
    inputRef,
  } = useComboboxContext();

  const activeDescendant =
    highlightedIndex >= 0 ? filteredOptions[highlightedIndex]?.id : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(0);
        } else {
          setHighlightedIndex(
            Math.min(highlightedIndex + 1, filteredOptions.length - 1),
          );
        }
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(filteredOptions.length - 1);
        } else {
          setHighlightedIndex(Math.max(highlightedIndex - 1, 0));
        }
        break;
      }
      case "Home": {
        if (isOpen) {
          e.preventDefault();
          setHighlightedIndex(0);
        }
        break;
      }
      case "End": {
        if (isOpen) {
          e.preventDefault();
          setHighlightedIndex(filteredOptions.length - 1);
        }
        break;
      }
      case "Enter": {
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          const opt = filteredOptions[highlightedIndex];
          selectValue(opt.value, opt.label);
        }
        break;
      }
      case "Escape": {
        e.preventDefault();
        if (isOpen) {
          setIsOpen(false);
        } else {
          setInputValue("");
        }
        break;
      }
    }
  };

  return (
    <input
      ref={inputRef}
      role="combobox"
      type="text"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-controls={listboxId}
      aria-activedescendant={activeDescendant}
      aria-autocomplete="list"
      value={inputValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={() => {
        if (inputValue) setIsOpen(true);
      }}
      {...props}
    />
  );
}

function Content({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"ul">) {
  const { isOpen, listboxId } = useComboboxContext();

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
    filteredOptions,
    registerOption,
    inputValue,
  } = useComboboxContext();

  const optionId = `combobox-option-${React.useId()}`;
  const label = typeof children === "string" ? children : value;

  React.useEffect(() => {
    registerOption(value, label, optionId);
  }, [value, label, optionId, registerOption]);

  // Hide option if it doesn't match filter
  if (inputValue && !label.toLowerCase().includes(inputValue.toLowerCase())) {
    return null;
  }

  const index = filteredOptions.findIndex((o) => o.value === value);
  const isSelected = selectedValue === value;
  const isHighlighted = highlightedIndex === index;

  return (
    <li
      role="option"
      id={optionId}
      aria-selected={isSelected}
      data-highlighted={isHighlighted || undefined}
      data-state={isSelected ? "selected" : undefined}
      onClick={() => selectValue(value, label)}
      onPointerMove={() => setHighlightedIndex(index)}
      {...props}
    >
      {children}
    </li>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  const { filteredOptions, isOpen } = useComboboxContext();
  if (!isOpen || filteredOptions.length > 0) return null;
  return <li role="presentation">{children}</li>;
}

export const Combobox = { Root, Input, Content, Option, Empty };
