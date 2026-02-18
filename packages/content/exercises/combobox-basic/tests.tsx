import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Combobox } from "./initial";

function renderCombobox(defaultValue = "") {
  return render(
    <Combobox.Root defaultValue={defaultValue}>
      <Combobox.Input placeholder="Search fruits..." />
      <Combobox.Content>
        <Combobox.Option value="apple">Apple</Combobox.Option>
        <Combobox.Option value="banana">Banana</Combobox.Option>
        <Combobox.Option value="cherry">Cherry</Combobox.Option>
        <Combobox.Option value="blueberry">Blueberry</Combobox.Option>
        <Combobox.Empty>No fruits found</Combobox.Empty>
      </Combobox.Content>
    </Combobox.Root>,
  );
}

describe("Combobox", () => {
  test("renders an input with role='combobox'", () => {
    renderCombobox();
    expect(screen.getByRole("combobox")).toBeDefined();
  });

  test("input has aria-haspopup='listbox'", () => {
    renderCombobox();
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-haspopup",
      "listbox",
    );
  });

  test("input has aria-autocomplete='list'", () => {
    renderCombobox();
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-autocomplete",
      "list",
    );
  });

  test("input has aria-expanded='false' when closed", () => {
    renderCombobox();
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  test("typing in the input opens the popup", () => {
    renderCombobox();
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "a" } });
    expect(screen.getByRole("listbox")).toBeDefined();
    expect(input).toHaveAttribute("aria-expanded", "true");
  });

  test("typing filters options", () => {
    renderCombobox();
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "b" } });
    const options = screen.getAllByRole("option");
    // Should show "Banana" and "Blueberry"
    expect(options).toHaveLength(2);
  });

  test("shows empty message when no options match", () => {
    renderCombobox();
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "xyz" } });
    expect(screen.getByText("No fruits found")).toBeDefined();
  });

  test("ArrowDown opens popup and highlights first option", () => {
    renderCombobox();
    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(screen.getByRole("listbox")).toBeDefined();
    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveAttribute("data-highlighted", "true");
  });

  test("ArrowDown navigates through options", () => {
    renderCombobox();
    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" }); // highlight Apple
    fireEvent.keyDown(input, { key: "ArrowDown" }); // highlight Banana
    const options = screen.getAllByRole("option");
    expect(options[1]).toHaveAttribute("data-highlighted", "true");
  });

  test("Enter selects highlighted option and closes popup", () => {
    renderCombobox();
    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" }); // highlight Apple
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(input).toHaveValue("Apple");
  });

  test("clicking an option selects it", () => {
    renderCombobox();
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "a" } });
    fireEvent.click(screen.getByRole("option", { name: "Apple" }));
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(input).toHaveValue("Apple");
  });

  test("Escape closes the popup when open", () => {
    renderCombobox();
    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(screen.getByRole("listbox")).toBeDefined();
    fireEvent.keyDown(input, { key: "Escape" });
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  test("Escape clears the input when popup is already closed", () => {
    renderCombobox();
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "apple" } });
    fireEvent.keyDown(input, { key: "Escape" }); // close popup
    fireEvent.keyDown(input, { key: "Escape" }); // clear input
    expect(input).toHaveValue("");
  });

  test("calls onValueChange when an option is selected", () => {
    const onValueChange = vi.fn();
    render(
      <Combobox.Root onValueChange={onValueChange}>
        <Combobox.Input />
        <Combobox.Content>
          <Combobox.Option value="apple">Apple</Combobox.Option>
        </Combobox.Content>
      </Combobox.Root>,
    );

    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onValueChange).toHaveBeenCalledWith("apple");
  });

  test("input has aria-controls pointing to the listbox", () => {
    renderCombobox();
    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    const controlsId = input.getAttribute("aria-controls");
    const listbox = screen.getByRole("listbox");
    expect(controlsId).toBeTruthy();
    expect(listbox.id).toBe(controlsId);
  });
});
