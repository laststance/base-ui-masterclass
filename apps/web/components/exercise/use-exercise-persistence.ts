"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_PREFIX = "bum-exercise-";

/**
 * Persists exercise WIP code to localStorage with debounced writes.
 * Allows students to resume where they left off between sessions.
 *
 * @param exerciseId - Unique exercise identifier
 * @param initialCode - Default starting code (used when no saved code exists)
 * @returns Tuple of [currentCode, updateCode, clearSaved, hasSavedCode]
 *
 * @example
 * const [code, setCode, clearSaved, hasSaved] = useExercisePersistence(
 *   "button-basic",
 *   initialCodeFromServer
 * );
 */
export function useExercisePersistence(
  exerciseId: string,
  initialCode: string,
): [string, (code: string) => void, () => void, boolean] {
  const key = `${STORAGE_PREFIX}${exerciseId}`;
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [hasSavedCode, setHasSavedCode] = useState(false);
  const [code, setCodeState] = useState(initialCode);

  // Load saved code on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        setCodeState(saved);
        setHasSavedCode(true);
      }
    } catch {
      // localStorage unavailable (SSR, private browsing)
    }
  }, [key]);

  // Debounced write to localStorage
  const updateCode = useCallback(
    (newCode: string) => {
      setCodeState(newCode);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        try {
          localStorage.setItem(key, newCode);
          setHasSavedCode(true);
        } catch {
          // quota exceeded or unavailable
        }
      }, 500);
    },
    [key],
  );

  // Clear saved progress (reset to initial)
  const clearSaved = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    setCodeState(initialCode);
    setHasSavedCode(false);
  }, [key, initialCode]);

  return [code, updateCode, clearSaved, hasSavedCode];
}
