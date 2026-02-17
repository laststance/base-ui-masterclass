import * as React from "react";
import { createPortal } from "react-dom";

/**
 * Headless AlertDialog component with compound components.
 *
 * A specialized dialog for critical confirmations that cannot be
 * dismissed casually. The user must explicitly choose Cancel or Action.
 *
 * @example
 * <AlertDialog.Root>
 *   <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
 *   <AlertDialog.Portal>
 *     <AlertDialog.Overlay className="overlay" />
 *     <AlertDialog.Content className="content">
 *       <AlertDialog.Title>Delete Project</AlertDialog.Title>
 *       <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
 *       <AlertDialog.Cancel data-autofocus>Cancel</AlertDialog.Cancel>
 *       <AlertDialog.Action onClick={handleDelete}>Delete</AlertDialog.Action>
 *     </AlertDialog.Content>
 *   </AlertDialog.Portal>
 * </AlertDialog.Root>
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

/**
 * Root component that manages alert dialog open/close state.
 *
 * @param defaultOpen - Whether the alert dialog starts open (default: false)
 * @param onOpenChange - Callback when open state changes
 * @param children - AlertDialog sub-components
 *
 * @example
 * <AlertDialog.Root onOpenChange={(open) => console.log(open)}>
 *   {children}
 * </AlertDialog.Root>
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

  return (
    <AlertDialogContext value={ctx}>{children}</AlertDialogContext>
  );
}

/**
 * Button that opens the alert dialog.
 *
 * @param children - Button content
 *
 * @example
 * <AlertDialog.Trigger>Delete Account</AlertDialog.Trigger>
 */
function Trigger({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  const { setOpen, triggerRef } = useAlertDialogContext();

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
 * Portal that renders alert dialog children into document.body when open.
 *
 * @param children - AlertDialog.Overlay and AlertDialog.Content
 *
 * @example
 * <AlertDialog.Portal>
 *   <AlertDialog.Overlay />
 *   <AlertDialog.Content>...</AlertDialog.Content>
 * </AlertDialog.Portal>
 */
function Portal({ children }: { children: React.ReactNode }) {
  const { open } = useAlertDialogContext();

  if (!open) return null;

  return createPortal(
    <div data-portal="">{children}</div>,
    document.body,
  );
}

/**
 * Non-dismissable backdrop overlay. Does NOT close on click.
 *
 * @param className - CSS class for styling
 *
 * @example
 * <AlertDialog.Overlay className="alert-overlay" />
 */
function Overlay({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // KEY DIFFERENCE: No onClick handler — backdrop does NOT close
  return (
    <div
      className={className}
      data-alert-dialog-overlay=""
      aria-hidden="true"
      {...props}
    />
  );
}

/**
 * The alert dialog content panel with focus trap and ARIA semantics.
 * Escape key is blocked to prevent accidental dismissal.
 *
 * @param children - Dialog body content
 * @param className - CSS class for styling
 *
 * @example
 * <AlertDialog.Content className="alert-content">
 *   <AlertDialog.Title>Confirm Delete</AlertDialog.Title>
 *   <AlertDialog.Description>Cannot be undone.</AlertDialog.Description>
 *   <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
 *   <AlertDialog.Action>Delete</AlertDialog.Action>
 * </AlertDialog.Content>
 */
function Content({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { open, titleId, descriptionId, triggerRef, contentRef } =
    useAlertDialogContext();

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

  // Initial focus — prefer data-autofocus (should be the cancel button)
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

  // KEY DIFFERENCE: Escape does NOT close the alert dialog
  React.useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

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
        role="alertdialog"
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
 * The alert dialog title, linked via aria-labelledby.
 *
 * @param children - Title text
 *
 * @example
 * <AlertDialog.Title>Delete Project</AlertDialog.Title>
 */
function Title({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"h2">) {
  const { titleId } = useAlertDialogContext();
  return (
    <h2 id={titleId} {...props}>
      {children}
    </h2>
  );
}

/**
 * The alert dialog description, linked via aria-describedby.
 *
 * @param children - Description text
 *
 * @example
 * <AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
 */
function Description({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  const { descriptionId } = useAlertDialogContext();
  return (
    <p id={descriptionId} {...props}>
      {children}
    </p>
  );
}

/**
 * Button that cancels and closes the alert dialog without performing an action.
 *
 * @param children - Button content
 *
 * @example
 * <AlertDialog.Cancel data-autofocus>Cancel</AlertDialog.Cancel>
 */
function Cancel({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  const { setOpen } = useAlertDialogContext();

  return (
    <button type="button" onClick={() => setOpen(false)} {...props}>
      {children}
    </button>
  );
}

/**
 * Button that performs the destructive action and then closes the alert dialog.
 *
 * @param children - Button content
 * @param onClick - The action handler to run before closing
 *
 * @example
 * <AlertDialog.Action onClick={handleDelete}>Delete Forever</AlertDialog.Action>
 */
function Action({
  children,
  onClick,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  const { setOpen } = useAlertDialogContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    setOpen(false);
  };

  return (
    <button type="button" onClick={handleClick} {...props}>
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
