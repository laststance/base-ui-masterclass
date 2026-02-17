import * as React from "react";
import { createPortal } from "react-dom";

/**
 * TODO: Build a headless Dialog component with compound components.
 *
 * Requirements:
 * 1. Dialog.Root manages open/close state (uncontrolled with defaultOpen)
 * 2. Dialog.Trigger opens the dialog on click
 * 3. Dialog.Portal renders children into a portal when open
 * 4. Dialog.Overlay renders a backdrop that closes the dialog on click
 * 5. Dialog.Content has role="dialog", aria-modal="true", aria-labelledby, aria-describedby
 * 6. Focus trap: Tab/Shift+Tab cycle within the dialog using sentinel elements
 * 7. Focus moves to first focusable element on open (or data-autofocus target)
 * 8. Escape key closes the dialog
 * 9. Focus returns to the trigger when the dialog closes
 * 10. Dialog.Title sets the accessible title via aria-labelledby
 * 11. Dialog.Description sets the accessible description via aria-describedby
 * 12. Dialog.Close button closes the dialog
 */

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext(): DialogContextValue {
  const ctx = React.useContext(DialogContext);
  if (!ctx) throw new Error("Dialog components must be used within Dialog.Root");
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

  return <DialogContext value={ctx}>{children}</DialogContext>;
}

function Trigger({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  const { triggerRef } = useDialogContext();

  // TODO: Open the dialog on click
  return (
    <button ref={triggerRef} type="button" {...props}>
      {children}
    </button>
  );
}

function Portal({ children }: { children: React.ReactNode }) {
  const { open } = useDialogContext();

  // TODO: Render through createPortal when open
  if (!open) return null;
  return <>{children}</>;
}

function Overlay({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // TODO: Close the dialog when clicking the overlay
  return <div className={className} aria-hidden="true" {...props} />;
}

function Content({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { contentRef, titleId, descriptionId } = useDialogContext();

  // TODO:
  // 1. Add role="dialog", aria-modal="true", aria-labelledby, aria-describedby
  // 2. Add sentinel elements for focus trap (Tab cycling)
  // 3. Focus first focusable element on open (or data-autofocus target)
  // 4. Close on Escape key
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
  const { titleId } = useDialogContext();

  // TODO: Set id to titleId for aria-labelledby
  return <h2 {...props}>{children}</h2>;
}

function Description({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  const { descriptionId } = useDialogContext();

  // TODO: Set id to descriptionId for aria-describedby
  return <p {...props}>{children}</p>;
}

function Close({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  // TODO: Close the dialog on click
  return (
    <button type="button" {...props}>
      {children}
    </button>
  );
}

export const Dialog = {
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Title,
  Description,
  Close,
};
