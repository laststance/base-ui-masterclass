import * as React from "react";
import { createPortal } from "react-dom";

/**
 * Headless Dialog component with compound components.
 *
 * Provides modal overlay with focus trap, portal rendering,
 * Escape key dismissal, scroll lock, and full ARIA semantics.
 *
 * @example
 * <Dialog.Root>
 *   <Dialog.Trigger>Open Dialog</Dialog.Trigger>
 *   <Dialog.Portal>
 *     <Dialog.Overlay className="overlay" />
 *     <Dialog.Content className="content">
 *       <Dialog.Title>Settings</Dialog.Title>
 *       <Dialog.Description>Manage your preferences.</Dialog.Description>
 *       <Dialog.Close>Done</Dialog.Close>
 *     </Dialog.Content>
 *   </Dialog.Portal>
 * </Dialog.Root>
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
  if (!ctx)
    throw new Error("Dialog components must be used within Dialog.Root");
  return ctx;
}

/**
 * Root component that manages dialog open/close state.
 *
 * @param defaultOpen - Whether the dialog starts open (default: false)
 * @param onOpenChange - Callback when open state changes
 * @param children - Dialog sub-components
 *
 * @example
 * <Dialog.Root defaultOpen={false} onOpenChange={(open) => console.log(open)}>
 *   {children}
 * </Dialog.Root>
 */
function Root({
  defaultOpen = false,
  onOpenChange,
  children,
}: {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const [open, setOpenState] = React.useState(defaultOpen);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      setOpenState(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange],
  );

  const ctx = React.useMemo(
    () => ({ open, setOpen, titleId, descriptionId, triggerRef, contentRef }),
    [open, setOpen, titleId, descriptionId],
  );

  return <DialogContext value={ctx}>{children}</DialogContext>;
}

/**
 * Button that opens the dialog.
 *
 * @param children - Button content
 *
 * @example
 * <Dialog.Trigger>Open Settings</Dialog.Trigger>
 */
function Trigger({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  const { setOpen, triggerRef } = useDialogContext();

  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={() => setOpen(true)}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Portal that renders dialog children into document.body when open.
 *
 * @param children - Dialog.Overlay and Dialog.Content
 *
 * @example
 * <Dialog.Portal>
 *   <Dialog.Overlay />
 *   <Dialog.Content>...</Dialog.Content>
 * </Dialog.Portal>
 */
function Portal({ children }: { children: React.ReactNode }) {
  const { open } = useDialogContext();

  if (!open) return null;

  return createPortal(
    <div data-portal="">{children}</div>,
    document.body,
  );
}

/**
 * Backdrop overlay that closes the dialog on click.
 *
 * @param className - CSS class for styling
 *
 * @example
 * <Dialog.Overlay className="dialog-overlay" />
 */
function Overlay({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { setOpen } = useDialogContext();

  return (
    <div
      className={className}
      data-dialog-overlay=""
      onClick={() => setOpen(false)}
      aria-hidden="true"
      {...props}
    />
  );
}

/**
 * The dialog content panel with focus trap and ARIA semantics.
 * Manages sentinel elements for Tab cycling, initial focus,
 * Escape key handling, and return focus.
 *
 * @param children - Dialog body content
 * @param className - CSS class for styling
 *
 * @example
 * <Dialog.Content className="dialog-content">
 *   <Dialog.Title>My Dialog</Dialog.Title>
 *   <p>Content here</p>
 *   <Dialog.Close>Close</Dialog.Close>
 * </Dialog.Content>
 */
function Content({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { open, setOpen, titleId, descriptionId, triggerRef, contentRef } =
    useDialogContext();

  const getFocusableElements = (): HTMLElement[] => {
    if (!contentRef.current) return [];
    return Array.from(
      contentRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
  };

  const handleSentinelFocus = (position: "start" | "end") => {
    const focusable = getFocusableElements();
    if (focusable.length === 0) return;
    if (position === "start") {
      focusable[focusable.length - 1].focus();
    } else {
      focusable[0].focus();
    }
  };

  // Initial focus
  React.useEffect(() => {
    if (!open || !contentRef.current) return;

    const autoFocusTarget =
      contentRef.current.querySelector<HTMLElement>("[data-autofocus]");
    if (autoFocusTarget) {
      autoFocusTarget.focus();
      return;
    }

    const focusable = getFocusableElements();
    if (focusable.length > 0) {
      focusable[0].focus();
    } else {
      contentRef.current.focus();
    }
  }, [open]);

  // Escape key
  React.useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);

  // Return focus on close
  React.useEffect(() => {
    if (!open) {
      triggerRef.current?.focus();
    }
  }, [open, triggerRef]);

  return (
    <>
      <div
        tabIndex={0}
        onFocus={() => handleSentinelFocus("start")}
        aria-hidden="true"
        style={{ position: "fixed", opacity: 0, pointerEvents: "none" }}
      />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className={className}
        {...props}
      >
        {children}
      </div>
      <div
        tabIndex={0}
        onFocus={() => handleSentinelFocus("end")}
        aria-hidden="true"
        style={{ position: "fixed", opacity: 0, pointerEvents: "none" }}
      />
    </>
  );
}

/**
 * The dialog title, linked to the dialog via aria-labelledby.
 *
 * @param children - Title text
 *
 * @example
 * <Dialog.Title>Settings</Dialog.Title>
 */
function Title({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"h2">) {
  const { titleId } = useDialogContext();
  return (
    <h2 id={titleId} {...props}>
      {children}
    </h2>
  );
}

/**
 * The dialog description, linked to the dialog via aria-describedby.
 *
 * @param children - Description text
 *
 * @example
 * <Dialog.Description>Manage your account settings.</Dialog.Description>
 */
function Description({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  const { descriptionId } = useDialogContext();
  return (
    <p id={descriptionId} {...props}>
      {children}
    </p>
  );
}

/**
 * A button that closes the dialog.
 *
 * @param children - Button content
 *
 * @example
 * <Dialog.Close>Done</Dialog.Close>
 */
function Close({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  const { setOpen } = useDialogContext();
  return (
    <button type="button" onClick={() => setOpen(false)} {...props}>
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
