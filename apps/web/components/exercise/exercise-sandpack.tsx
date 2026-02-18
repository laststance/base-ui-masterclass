"use client";

import { useState, useCallback, useTransition, useEffect, useRef } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackTests,
  useActiveCode,
} from "@codesandbox/sandpack-react";
import { useTranslations } from "next-intl";
import { useExercisePersistence } from "./use-exercise-persistence";
import { SANDPACK_THEME } from "@/lib/config/sandpack-theme";
import { completeExercise } from "@/lib/actions/progress";

type TestStatus = "pass" | "fail";

interface TestResult {
  status: TestStatus;
  passed: number;
  failed: number;
}

interface ExerciseSandpackProps {
  exerciseId: string;
  initialCode: string;
  solutionCode: string;
  testCode: string;
  hints: string[];
  dependencies?: Record<string, string>;
  initialCompleted?: boolean;
}

/**
 * Collects pass/fail counts from Sandpack's nested spec structure.
 *
 * @param specs - Sandpack onComplete specs (Record of Spec objects)
 * @returns Aggregated test result with status, passed, and failed counts
 *
 * @example
 * summarizeSpecs({ "file.test.tsx": { name: "...", tests: {...}, describes: {...} } })
 * // => { status: "pass", passed: 3, failed: 0 }
 */
function summarizeSpecs(
  specs: Record<string, { tests: Record<string, { status: string }>; describes: Record<string, unknown> }>,
): TestResult {
  let passed = 0;
  let failed = 0;

  function walk(node: { tests?: Record<string, { status: string }>; describes?: Record<string, unknown> }) {
    if (node.tests) {
      for (const test of Object.values(node.tests)) {
        if (test.status === "pass") passed++;
        else if (test.status === "fail" || test.status === "error") failed++;
      }
    }
    if (node.describes) {
      for (const desc of Object.values(node.describes)) {
        walk(desc as { tests?: Record<string, { status: string }>; describes?: Record<string, unknown> });
      }
    }
  }

  for (const spec of Object.values(specs)) {
    walk(spec);
  }

  return { status: failed === 0 && passed > 0 ? "pass" : "fail", passed, failed };
}

/**
 * Bridges Sandpack's internal editor state with the persistence hook.
 * Must be rendered inside SandpackProvider. Skips the initial render
 * to avoid overwriting loaded code, and ignores changes while
 * the solution is displayed.
 *
 * @param onCodeChange - Callback to persist code (from useExercisePersistence)
 * @param disabled - When true, changes are not persisted (e.g. viewing solution)
 *
 * @example
 * <SandpackProvider>
 *   <CodePersistenceListener onCodeChange={setCode} disabled={showSolution} />
 * </SandpackProvider>
 */
function CodePersistenceListener({
  onCodeChange,
  disabled,
}: {
  onCodeChange: (code: string) => void;
  disabled: boolean;
}) {
  const { code } = useActiveCode();
  const isInitialRef = useRef(true);

  useEffect(() => {
    if (isInitialRef.current) {
      isInitialRef.current = false;
      return;
    }
    if (!disabled) {
      onCodeChange(code);
    }
  }, [code, onCodeChange, disabled]);

  return null;
}

/**
 * Interactive exercise environment powered by Sandpack.
 * Provides code editor, test runner, hints, solution reveal,
 * test-pass detection, and exercise completion.
 *
 * @param exerciseId - Unique identifier for localStorage persistence
 * @param initialCode - Starting code template
 * @param solutionCode - Reference solution (revealed on demand)
 * @param testCode - Jest test suite run by SandpackTests
 * @param hints - Progressive hints shown after failed attempts
 * @param dependencies - Additional npm dependencies for the exercise
 * @param initialCompleted - Whether the exercise was already completed
 *
 * @example
 * <ExerciseSandpack
 *   exerciseId="button-basic"
 *   initialCode={exercise.files.initial}
 *   solutionCode={exercise.files.solution}
 *   testCode={exercise.files.tests}
 *   hints={exercise.meta.hints.en}
 *   initialCompleted={false}
 * />
 */
export function ExerciseSandpack({
  exerciseId,
  initialCode,
  solutionCode,
  testCode,
  hints,
  dependencies = {},
  initialCompleted = false,
}: ExerciseSandpackProps) {
  const t = useTranslations("exercise");
  const [code, setCode, clearSaved, hasSavedCode] = useExercisePersistence(
    exerciseId,
    initialCode,
  );
  const [showSolution, setShowSolution] = useState(false);
  const [hintIndex, setHintIndex] = useState(-1);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [showCompletionToast, setShowCompletionToast] = useState(false);
  const [isPending, startTransition] = useTransition();

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
    setTestResult(null);
  }, [clearSaved]);

  const handleTestComplete = useCallback(
    (specs: Record<string, { tests: Record<string, { status: string }>; describes: Record<string, unknown> }>) => {
      setTestResult(summarizeSpecs(specs));
    },
    [],
  );

  const handleMarkComplete = useCallback(() => {
    startTransition(async () => {
      try {
        const result = await completeExercise(exerciseId);
        if (result.success) {
          setIsCompleted(true);
          setShowCompletionToast(true);
          setTimeout(() => setShowCompletionToast(false), 3000);
        } else {
          console.error("Failed to mark exercise complete:", result.error);
        }
      } catch (err) {
        console.error("Unexpected error marking exercise complete:", err);
      }
    });
  }, [exerciseId]);

  const activeCode = showSolution ? solutionCode : code;
  const allPassed = testResult?.status === "pass";

  return (
    <div className="my-8 rounded-lg border border-accent/30 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-surface px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-2 w-2 rounded-full bg-accent" />
          <span className="text-xs font-mono text-text-muted">
            {exerciseId}
          </span>
          {hasSavedCode && !showSolution && (
            <span className="text-xs text-text-muted bg-surface-elevated px-1.5 py-0.5 rounded">
              {t("saved")}
            </span>
          )}
          {isCompleted && (
            <span className="text-xs text-success bg-success/10 px-1.5 py-0.5 rounded font-semibold">
              {t("completed")}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          {hints.length > 0 && (
            <button
              type="button"
              onClick={handleShowNextHint}
              disabled={hintIndex >= hints.length - 1}
              className="text-xs px-2 sm:px-3 py-1 min-h-[44px] rounded border border-border text-text-muted hover:text-text-secondary hover:bg-surface-elevated disabled:opacity-40 transition-colors inline-flex items-center"
            >
              {t("hint")}{" "}
              ({Math.min(hintIndex + 2, hints.length)}/{hints.length})
            </button>
          )}
          <button
            type="button"
            onClick={handleToggleSolution}
            className="text-xs px-2 sm:px-3 py-1 min-h-[44px] rounded border border-border text-text-muted hover:text-accent hover:border-accent/40 transition-colors inline-flex items-center"
          >
            {showSolution ? t("myCode") : t("solution")}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs px-2 sm:px-3 py-1 min-h-[44px] rounded border border-border text-text-muted hover:text-error hover:border-error/40 transition-colors inline-flex items-center"
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
        <CodePersistenceListener onCodeChange={setCode} disabled={showSolution} />
        <SandpackLayout>
          <SandpackCodeEditor
            showLineNumbers
            showInlineErrors
            style={{ minHeight: "300px" }}
          />
          <SandpackTests
            style={{ minHeight: "300px" }}
            onComplete={handleTestComplete}
          />
        </SandpackLayout>
      </SandpackProvider>

      {/* Test result banner + Complete button */}
      <div role="status" aria-live="polite" aria-atomic="true">
        {!testResult && (
          <div className="border-t border-border px-4 py-3 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full border-2 border-text-muted border-t-transparent animate-spin" />
            <span className="text-xs text-text-muted">{t("runningTests")}</span>
          </div>
        )}
        {testResult && (
          <div
            className={`border-t px-4 py-3 flex items-center justify-between ${
              allPassed
                ? "bg-success/5 border-success/20"
                : "bg-error/5 border-error/20"
            }`}
          >
            <span
              className={`text-sm font-semibold ${
                allPassed ? "text-success" : "text-error"
              }`}
            >
              {allPassed
                ? t("allTestsPassed")
                : t("testsFailed", { count: testResult.failed })}
            </span>
            {allPassed && !isCompleted && (
              <button
                type="button"
                onClick={handleMarkComplete}
                disabled={isPending}
                className="text-sm px-4 py-2.5 min-h-[44px] rounded-md bg-success text-background font-semibold hover:bg-success/90 disabled:opacity-60 transition-colors"
              >
                {isPending ? t("completing") : t("markComplete")}
              </button>
            )}
            {allPassed && isCompleted && (
              <span className="text-sm text-success font-semibold">
                {t("completed")}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Solution indicator */}
      {showSolution && (
        <div className="bg-success/5 border-t border-success/20 px-4 py-2 text-center">
          <span className="text-xs text-success font-semibold">
            {t("solutionIndicator")}
          </span>
        </div>
      )}

      {/* Completion toast */}
      {showCompletionToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 animate-[fade-in-up_0.3s_ease-out] rounded-lg bg-success px-5 py-3 text-sm font-semibold text-background shadow-lg"
        >
          {t("completionToast")}
        </div>
      )}
    </div>
  );
}
