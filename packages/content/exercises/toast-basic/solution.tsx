import * as React from "react";
import { useSyncExternalStore } from "react";

type ToastVariant = "info" | "success" | "error" | "warning";

interface ToastData {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
}

// --- External Store ---

type Listener = () => void;

let toasts: ToastData[] = [];
const listeners: Set<Listener> = new Set();

function notify(): void {
  listeners.forEach((fn) => fn());
}

/**
 * Subscribes a listener to toast store changes.
 * @param listener - Callback invoked when the toast list changes.
 * @returns An unsubscribe function.
 * @example
 * const unsub = subscribe(() => console.log("toasts changed"));
 * unsub(); // stop listening
 */
function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Returns the current snapshot of the toast array.
 * @returns The current list of toasts.
 * @example
 * const current = getSnapshot(); // ToastData[]
 */
function getSnapshot(): ToastData[] {
  return toasts;
}

let counter = 0;

/**
 * Adds a new toast to the store.
 * @param message - The toast message.
 * @param variant - The toast variant.
 * @param duration - Auto-dismiss duration in ms.
 * @returns The generated toast id.
 * @example
 * const id = addToast("Saved!", "success", 3000);
 */
function addToast(
  message: string,
  variant: ToastVariant = "info",
  duration = 5000,
): string {
  const id = `toast-${++counter}`;
  toasts = [...toasts, { id, message, variant, duration }];
  notify();
  return id;
}

/**
 * Removes a toast from the store by id.
 * @param id - The toast id to dismiss.
 * @example
 * dismissToast("toast-1");
 */
function dismissToast(id: string): void {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

// --- React Hook ---

function useToasts(): ToastData[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

// --- Auto Dismiss Hook ---

function useAutoDismiss(id: string, duration: number) {
  const [paused, setPaused] = React.useState(false);
  const remainingRef = React.useRef(duration);
  const startRef = React.useRef(Date.now());

  React.useEffect(() => {
    if (paused) {
      remainingRef.current -= Date.now() - startRef.current;
      return;
    }

    startRef.current = Date.now();
    const timer = setTimeout(() => {
      dismissToast(id);
    }, remainingRef.current);

    return () => clearTimeout(timer);
  }, [id, paused]);

  return {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocus: () => setPaused(true),
    onBlur: () => setPaused(false),
  };
}

// --- Components ---

function ToastProvider({ children }: { children: React.ReactNode }) {
  const currentToasts = useToasts();

  return (
    <>
      {children}
      <div
        aria-live="polite"
        data-testid="toast-container"
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          display: "flex",
          flexDirection: "column-reverse",
          gap: 8,
          zIndex: 9999,
          pointerEvents: "none",
        }}
      >
        {currentToasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </div>
    </>
  );
}

function ToastItem({ toast: t }: { toast: ToastData }) {
  const autoDismiss = useAutoDismiss(t.id, t.duration);
  const role = t.variant === "error" ? "alert" : "status";

  return (
    <div
      role={role}
      data-variant={t.variant}
      data-testid={`toast-${t.id}`}
      style={{ pointerEvents: "auto" }}
      {...autoDismiss}
    >
      <p>{t.message}</p>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => dismissToast(t.id)}
      >
        Close
      </button>
    </div>
  );
}

// --- Public API ---

/**
 * Imperatively show a toast notification.
 * @param message - The message text to display.
 * @param variant - Visual variant: "info" | "success" | "error" | "warning".
 * @param duration - Auto-dismiss time in milliseconds (default 5000).
 * @returns The toast id for programmatic dismissal.
 * @example
 * toast("File saved", "success");
 * toast("Network error", "error", 10000);
 */
function toast(
  message: string,
  variant?: ToastVariant,
  duration?: number,
): string {
  return addToast(message, variant, duration);
}

export { ToastProvider, toast, dismissToast };
export type { ToastData, ToastVariant };
