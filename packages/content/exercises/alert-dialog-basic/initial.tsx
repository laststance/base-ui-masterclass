import * as React from "react";
import { createPortal } from "react-dom";

/**
 * TODO: Build a headless AlertDialog component with compound components.
 *
 * Requirements:
 * 1. AlertDialog.Root manages open/close state (uncontrolled with defaultOpen)
 * 2. AlertDialog.Trigger opens the alert dialog on click
 * 3. AlertDialog.Portal renders children into a portal when open
 * 4. AlertDialog.Overlay renders a backdrop that does NOT close on click
 * 5. AlertDialog.Content has role="alertdialog", aria-modal="true"
 * 6. Focus trap with sentinel elements (same as Dialog)
 * 7. Escape key does NOT close the alert dialog (prevents accidental dismissal)
 * 8. Focus moves to first focusable element on open (prefer data-autofocus)
 * 9. Focus returns to trigger when the alert dialog closes
 * 10. AlertDialog.Cancel closes without action
 * 11. AlertDialog.Action performs the action and then closes
 */

interface AlertDialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const AlertDialogContext =
  React.createContext<AlertDialogContextValue | null>(null);

function useAlertDialogContext(): AlertDialogContextValue {
  const ctx = React.useContext(AlertDialogContext);
  if (!ctx)
    throw new Error(
      "AlertDialog components must be used within AlertDialog.Root",
    );
  return ctx;
}

function Root({
  defaultOpen = false,
  onOpenChange,
  children,
}: {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();

  // TODO: Implement open state management
  const open = defaultOpen;
  const setOpen = (_open: boolean) => {};

  const ctx = React.useMemo(
    () => ({ open, setOpen, titleId, descriptionId, triggerRef, contentRef }),
    [open, setOpen, titleId, descriptionId],
  );

  return (
    <AlertDialogContext value={ctx}>{children}</AlertDialogContext>
  );
}

function Trigger({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  const { triggerRef } = useAlertDialogContext();

  // TODO: Open the alert dialog on click
  return (
    <button ref={triggerRef} type="button" {...props}>
      {children}
    </button>
  );
}

function Portal({ children }: { children: React.ReactNode }) {
  const { open } = useAlertDialogContext();

  // TODO: Render through createPortal when open
  if (!open) return null;
  return <>{children}</>;
}

function Overlay({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // KEY DIFFERENCE: NO onClick handler — backdrop does NOT close the dialog
  return <div className={className} aria-hidden="true" {...props} />;
}

function Content({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { contentRef, titleId, descriptionId } = useAlertDialogContext();

  // TODO:
  // 1. Add role="alertdialog", aria-modal="true", aria-labelledby, aria-describedby
  // 2. Add sentinel elements for focus trap
  // 3. Focus first focusable element on open (prefer data-autofocus)
  // 4. Block Escape key (e.preventDefault())
  // 5. Return focus to trigger on close
  return (
    <div ref={contentRef} className={className} {...props}>
      {children}
    </div>
  );
}

function Title({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"h2">) {
  const { titleId } = useAlertDialogContext();

  // TODO: Set id to titleId
  return <h2 {...props}>{children}</h2>;
}

function Description({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  const { descriptionId } = useAlertDialogContext();

  // TODO: Set id to descriptionId
  return <p {...props}>{children}</p>;
}

function Cancel({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  // TODO: Close the alert dialog (no action taken)
  return (
    <button type="button" {...props}>
      {children}
    </button>
  );
}

function Action({
  children,
  onClick,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  // TODO: Call the provided onClick, then close the alert dialog
  return (
    <button type="button" onClick={onClick} {...props}>
      {children}
    </button>
  );
}

export const AlertDialog = {
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Title,
  Description,
  Cancel,
  Action,
};
