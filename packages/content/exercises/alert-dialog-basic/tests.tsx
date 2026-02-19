import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { AlertDialog } from "./initial";

function renderAlertDialog(defaultOpen = false) {
  const onAction = jest.fn();
  const result = render(
    <AlertDialog.Root defaultOpen={defaultOpen}>
      <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="overlay" />
        <AlertDialog.Content className="content">
          <AlertDialog.Title>Delete Project</AlertDialog.Title>
          <AlertDialog.Description>
            This action cannot be undone.
          </AlertDialog.Description>
          <AlertDialog.Cancel data-autofocus>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action onClick={onAction}>
            Delete Forever
          </AlertDialog.Action>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>,
  );
  return { ...result, onAction };
}

describe("AlertDialog", () => {
  test("alert dialog is hidden by default", () => {
    renderAlertDialog();
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });

  test("clicking trigger opens the alert dialog", () => {
    renderAlertDialog();
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByRole("alertdialog")).toBeDefined();
  });

  test("alert dialog has role='alertdialog'", () => {
    renderAlertDialog(true);
    expect(screen.getByRole("alertdialog")).toBeDefined();
  });

  test("alert dialog has aria-modal='true'", () => {
    renderAlertDialog(true);
    expect(screen.getByRole("alertdialog")).toHaveAttribute(
      "aria-modal",
      "true",
    );
  });

  test("alert dialog has aria-labelledby pointing to title", () => {
    renderAlertDialog(true);
    const dialog = screen.getByRole("alertdialog");
    const titleId = dialog.getAttribute("aria-labelledby");
    expect(titleId).toBeTruthy();

    const title = document.getElementById(titleId!);
    expect(title?.textContent).toBe("Delete Project");
  });

  test("alert dialog has aria-describedby pointing to description", () => {
    renderAlertDialog(true);
    const dialog = screen.getByRole("alertdialog");
    const descId = dialog.getAttribute("aria-describedby");
    expect(descId).toBeTruthy();

    const desc = document.getElementById(descId!);
    expect(desc?.textContent).toBe("This action cannot be undone.");
  });

  test("focus moves to data-autofocus element (Cancel) on open", () => {
    renderAlertDialog();
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    expect(document.activeElement).toBe(cancelButton);
  });

  test("Escape key does NOT close the alert dialog", () => {
    renderAlertDialog();
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByRole("alertdialog")).toBeDefined();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByRole("alertdialog")).toBeDefined();
  });

  test("clicking overlay does NOT close the alert dialog", () => {
    renderAlertDialog();
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByRole("alertdialog")).toBeDefined();

    const overlay = document.querySelector(".overlay")!;
    fireEvent.click(overlay);
    expect(screen.getByRole("alertdialog")).toBeDefined();
  });

  test("Cancel button closes the alert dialog", () => {
    renderAlertDialog();
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByRole("alertdialog")).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });

  test("Action button calls onClick and closes the alert dialog", () => {
    const { onAction } = renderAlertDialog();
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    fireEvent.click(screen.getByRole("button", { name: "Delete Forever" }));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });

  test("focus returns to trigger when alert dialog closes via Cancel", () => {
    renderAlertDialog();
    const trigger = screen.getByRole("button", { name: "Delete" });
    fireEvent.click(trigger);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(document.activeElement).toBe(trigger);
  });

  test("focus returns to trigger when alert dialog closes via Action", () => {
    renderAlertDialog();
    const trigger = screen.getByRole("button", { name: "Delete" });
    fireEvent.click(trigger);

    fireEvent.click(screen.getByRole("button", { name: "Delete Forever" }));
    expect(document.activeElement).toBe(trigger);
  });

  test("alert dialog renders through a portal", () => {
    renderAlertDialog(true);
    const dialog = screen.getByRole("alertdialog");
    const portal = dialog.closest("[data-portal]");
    expect(portal).toBeDefined();
    expect(portal?.parentElement).toBe(document.body);
  });
});
