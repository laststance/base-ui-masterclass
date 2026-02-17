import { render, screen, fireEvent } from "@testing-library/react";
import { Select } from "./initial";

function renderSelect(defaultValue = "") {
  return render(
    <Select.Root defaultValue={defaultValue}>
      <Select.Trigger>
        <Select.Value placeholder="Pick a fruit" />
      </Select.Trigger>
      <Select.Content>
        <Select.Option value="apple">Apple</Select.Option>
        <Select.Option value="banana">Banana</Select.Option>
        <Select.Option value="cherry">Cherry</Select.Option>
      </Select.Content>
    </Select.Root>,
  );
}

describe("Select", () => {
  test("renders a trigger with role='combobox'", () => {
    renderSelect();
    expect(screen.getByRole("combobox")).toBeDefined();
  });

  test("trigger has aria-haspopup='listbox'", () => {
    renderSelect();
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-haspopup",
      "listbox",
    );
  });

  test("trigger has aria-expanded='false' when closed", () => {
    renderSelect();
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  test("clicking the trigger opens the listbox", () => {
    renderSelect();
    fireEvent.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeDefined();
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  test("renders options with role='option'", () => {
    renderSelect();
    fireEvent.click(screen.getByRole("combobox"));
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3);
  });

  test("displays placeholder when no value is selected", () => {
    renderSelect();
    expect(screen.getByText("Pick a fruit")).toBeDefined();
  });

  test("displays selected value label", () => {
    renderSelect("banana");
    expect(screen.getByText("Banana")).toBeDefined();
  });

  test("clicking an option selects it and closes the popup", () => {
    renderSelect();
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "Banana" }));
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(screen.getByText("Banana")).toBeDefined();
  });

  test("selected option has aria-selected='true'", () => {
    renderSelect("apple");
    fireEvent.click(screen.getByRole("combobox"));
    const appleOption = screen.getByRole("option", { name: "Apple" });
    const bananaOption = screen.getByRole("option", { name: "Banana" });
    expect(appleOption).toHaveAttribute("aria-selected", "true");
    expect(bananaOption).toHaveAttribute("aria-selected", "false");
  });

  test("ArrowDown opens the popup when closed", () => {
    renderSelect();
    const trigger = screen.getByRole("combobox");
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(screen.getByRole("listbox")).toBeDefined();
  });

  test("ArrowDown moves highlight to next option when open", () => {
    renderSelect();
    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);
    // First option is highlighted by default (index 0)
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    // Now second option should be highlighted
    const options = screen.getAllByRole("option");
    expect(options[1]).toHaveAttribute("data-highlighted", "true");
  });

  test("Enter selects the highlighted option and closes", () => {
    renderSelect();
    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: "ArrowDown" }); // highlight Banana
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(screen.getByText("Banana")).toBeDefined();
  });

  test("Escape closes the popup without changing selection", () => {
    renderSelect("apple");
    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: "ArrowDown" }); // highlight Banana
    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(screen.getByText("Apple")).toBeDefined();
  });

  test("calls onValueChange when an option is selected", () => {
    const onValueChange = vi.fn();
    render(
      <Select.Root onValueChange={onValueChange}>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Option value="apple">Apple</Select.Option>
          <Select.Option value="banana">Banana</Select.Option>
        </Select.Content>
      </Select.Root>,
    );

    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "Apple" }));
    expect(onValueChange).toHaveBeenCalledWith("apple");
  });

  test("trigger has aria-controls pointing to the listbox", () => {
    renderSelect();
    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);
    const controlsId = trigger.getAttribute("aria-controls");
    const listbox = screen.getByRole("listbox");
    expect(controlsId).toBeTruthy();
    expect(listbox.id).toBe(controlsId);
  });
});
