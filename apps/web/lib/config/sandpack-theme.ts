import type { SandpackTheme } from "@codesandbox/sandpack-react";

/**
 * Sandpack editor theme matching the site's dark design system.
 * Centralized here to avoid drift between globals.css and the exercise editor.
 *
 * @example
 * <SandpackProvider theme={SANDPACK_THEME}>
 *   <SandpackCodeEditor />
 * </SandpackProvider>
 */
export const SANDPACK_THEME: SandpackTheme = {
  colors: {
    surface1: "#141416",
    surface2: "#1c1c1f",
    surface3: "#2a2a2e",
    clickable: "#a1a1aa",
    base: "#fafaf9",
    disabled: "#71717a",
    hover: "#e8b931",
    accent: "#e8b931",
    error: "#f87171",
    errorSurface: "#450a0a",
  },
  syntax: {
    plain: "#fafaf9",
    comment: { color: "#71717a", fontStyle: "italic" },
    keyword: "#c084fc",
    tag: "#60a5fa",
    punctuation: "#a1a1aa",
    definition: "#e8b931",
    property: "#60a5fa",
    static: "#4ade80",
    string: "#4ade80",
  },
  font: {
    body: '"Source Serif 4", Georgia, serif',
    mono: '"Fira Code", "JetBrains Mono", monospace',
    size: "13px",
    lineHeight: "1.6",
  },
};
