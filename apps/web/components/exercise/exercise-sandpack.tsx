"use client";

import { useState, useCallback } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackTests,
} from "@codesandbox/sandpack-react";
import { useTranslations } from "next-intl";
import { useExercisePersistence } from "./use-exercise-persistence";
import { SANDPACK_THEME } from "@/lib/config/sandpack-theme";

interface ExerciseSandpackProps {
  exerciseId: string;
  initialCode: string;
  solutionCode: string;
  testCode: string;
  hints: string[];
  dependencies?: Record<string, string>;
}

/**
 * Interactive exercise environment powered by Sandpack.
 * Provides code editor, test runner, hints, and solution reveal.
 *
 * @param exerciseId - Unique identifier for localStorage persistence
 * @param initialCode - Starting code template
 * @param solutionCode - Reference solution (revealed on demand)
 * @param testCode - Jest test suite run by SandpackTests
 * @param hints - Progressive hints shown after failed attempts
 * @param dependencies - Additional npm dependencies for the exercise
 *
 * @example
 * <ExerciseSandpack
 *   exerciseId="button-basic"
 *   initialCode={exercise.files.initial}
 *   solutionCode={exercise.files.solution}
 *   testCode={exercise.files.tests}
 *   hints={exercise.meta.hints.en}
 * />
 */
export function ExerciseSandpack({
  exerciseId,
  initialCode,
  solutionCode,
  testCode,
  hints,
  dependencies = {},
}: ExerciseSandpackProps) {
  const t = useTranslations("exercise");
  const [code, setCode, clearSaved, hasSavedCode] = useExercisePersistence(
    exerciseId,
    initialCode,
  );
  const [showSolution, setShowSolution] = useState(false);
  const [hintIndex, setHintIndex] = useState(-1);

  const handleShowNextHint = useCallback(() => {
    setHintIndex((prev) => Math.min(prev + 1, hints.length - 1));
  }, [hints.length]);

  const handleToggleSolution = useCallback(() => {
    setShowSolution((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    clearSaved();
    setShowSolution(false);
    setHintIndex(-1);
  }, [clearSaved]);

  const activeCode = showSolution ? solutionCode : code;

  return (
    <div className="my-8 rounded-lg border border-accent/30 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-surface px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-accent" />
          <span className="text-xs font-mono text-text-muted">
            {exerciseId}
          </span>
          {hasSavedCode && !showSolution && (
            <span className="text-xs text-text-muted bg-surface-elevated px-1.5 py-0.5 rounded">
              {t("saved")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hints.length > 0 && (
            <button
              type="button"
              onClick={handleShowNextHint}
              disabled={hintIndex >= hints.length - 1}
              className="text-xs px-3 py-1 rounded border border-border text-text-muted hover:text-text-secondary hover:bg-surface-elevated disabled:opacity-40 transition-colors"
            >
              {t("hint")}{" "}
              ({Math.min(hintIndex + 2, hints.length)}/{hints.length})
            </button>
          )}
          <button
            type="button"
            onClick={handleToggleSolution}
            className="text-xs px-3 py-1 rounded border border-border text-text-muted hover:text-accent hover:border-accent/40 transition-colors"
          >
            {showSolution ? t("myCode") : t("solution")}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs px-3 py-1 rounded border border-border text-text-muted hover:text-error hover:border-error/40 transition-colors"
          >
            {t("reset")}
          </button>
        </div>
      </div>

      {/* Hints */}
      {hintIndex >= 0 && (
        <div className="bg-accent/5 border-b border-accent/20 px-4 py-3">
          <div className="text-xs font-semibold text-accent mb-1">
            {t("hint")} {hintIndex + 1}
          </div>
          <p className="text-sm text-text-secondary">{hints[hintIndex]}</p>
        </div>
      )}

      {/* Sandpack */}
      <SandpackProvider
        template="test-ts"
        files={{
          "/initial.tsx": {
            code: activeCode,
            active: true,
          },
          "/initial.test.tsx": {
            code: testCode,
            hidden: true,
          },
        }}
        customSetup={{
          dependencies: {
            "@testing-library/react": "^14.0.0",
            "@testing-library/jest-dom": "^6.0.0",
            react: "^18.2.0",
            "react-dom": "^18.2.0",
            ...dependencies,
          },
        }}
        options={{
          activeFile: "/initial.tsx",
          visibleFiles: ["/initial.tsx"],
        }}
        theme={SANDPACK_THEME}
      >
        <SandpackLayout>
          <SandpackCodeEditor
            showLineNumbers
            showInlineErrors
            style={{ minHeight: "300px" }}
          />
          <SandpackTests
            style={{ minHeight: "300px" }}
          />
        </SandpackLayout>
      </SandpackProvider>

      {/* Solution indicator */}
      {showSolution && (
        <div className="bg-success/5 border-t border-success/20 px-4 py-2 text-center">
          <span className="text-xs text-success font-semibold">
            {t("solutionIndicator")}
          </span>
        </div>
      )}
    </div>
  );
}
