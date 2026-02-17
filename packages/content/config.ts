/**
 * Course curriculum configuration.
 * Defines module ordering, metadata, and lesson structure.
 * This is the single source of truth for the course outline.
 *
 * @example
 * import { modules } from "@base-ui-masterclass/content/config";
 * const firstModule = modules[0]; // Foundation module
 */

export interface ModuleConfig {
  slug: string;
  title: { en: string; ja: string };
  description: { en: string; ja: string };
  order: number;
  isFree: boolean;
  components: string[];
}

export const modules: ModuleConfig[] = [
  {
    slug: "00-foundation",
    title: { en: "Foundation", ja: "基礎" },
    description: {
      en: "Compound Components, TypeScript Generics, Project Setup",
      ja: "コンパウンドコンポーネント、TypeScriptジェネリクス、プロジェクトセットアップ",
    },
    order: 0,
    isFree: true,
    components: [],
  },
  {
    slug: "01-primitives",
    title: { en: "Primitives", ja: "プリミティブ" },
    description: {
      en: "Button, Input, Separator",
      ja: "Button, Input, Separator",
    },
    order: 1,
    isFree: false,
    components: ["Button", "Input", "Separator"],
  },
  {
    slug: "02-toggle-state",
    title: { en: "Toggle & State", ja: "トグル＆ステート" },
    description: {
      en: "Switch, Toggle, ToggleGroup, Checkbox",
      ja: "Switch, Toggle, ToggleGroup, Checkbox",
    },
    order: 2,
    isFree: false,
    components: ["Switch", "Toggle", "ToggleGroup", "Checkbox"],
  },
  {
    slug: "03-form-system",
    title: { en: "Form System", ja: "フォームシステム" },
    description: {
      en: "Field, Fieldset, Form, CheckboxGroup, Radio",
      ja: "Field, Fieldset, Form, CheckboxGroup, Radio",
    },
    order: 3,
    isFree: false,
    components: ["Field", "Fieldset", "Form", "CheckboxGroup", "Radio"],
  },
  {
    slug: "04-data-display",
    title: { en: "Data Display", ja: "データ表示" },
    description: {
      en: "Progress, Meter, Avatar",
      ja: "Progress, Meter, Avatar",
    },
    order: 4,
    isFree: false,
    components: ["Progress", "Meter", "Avatar"],
  },
  {
    slug: "05-disclosure",
    title: { en: "Disclosure", ja: "ディスクロージャー" },
    description: {
      en: "Collapsible, Accordion",
      ja: "Collapsible, Accordion",
    },
    order: 5,
    isFree: false,
    components: ["Collapsible", "Accordion"],
  },
  {
    slug: "06-navigation",
    title: { en: "Navigation", ja: "ナビゲーション" },
    description: {
      en: "Tabs, Toolbar",
      ja: "Tabs, Toolbar",
    },
    order: 6,
    isFree: false,
    components: ["Tabs", "Toolbar"],
  },
  {
    slug: "07-overlays-1",
    title: { en: "Overlays I — Positioning", ja: "オーバーレイ I — ポジショニング" },
    description: {
      en: "Tooltip, Popover, PreviewCard",
      ja: "Tooltip, Popover, PreviewCard",
    },
    order: 7,
    isFree: false,
    components: ["Tooltip", "Popover", "PreviewCard"],
  },
  {
    slug: "08-overlays-2",
    title: { en: "Overlays II — Modals", ja: "オーバーレイ II — モーダル" },
    description: {
      en: "Dialog, AlertDialog, Drawer",
      ja: "Dialog, AlertDialog, Drawer",
    },
    order: 8,
    isFree: false,
    components: ["Dialog", "AlertDialog", "Drawer"],
  },
  {
    slug: "09-selection",
    title: { en: "Selection", ja: "セレクション" },
    description: {
      en: "Select, Combobox, Autocomplete",
      ja: "Select, Combobox, Autocomplete",
    },
    order: 9,
    isFree: false,
    components: ["Select", "Combobox", "Autocomplete"],
  },
  {
    slug: "10-menus",
    title: { en: "Menu Systems", ja: "メニューシステム" },
    description: {
      en: "Menu, ContextMenu, Menubar, NavigationMenu",
      ja: "Menu, ContextMenu, Menubar, NavigationMenu",
    },
    order: 10,
    isFree: false,
    components: ["Menu", "ContextMenu", "Menubar", "NavigationMenu"],
  },
  {
    slug: "11-advanced",
    title: { en: "Advanced", ja: "アドバンスド" },
    description: {
      en: "NumberField, Slider, ScrollArea, Toast",
      ja: "NumberField, Slider, ScrollArea, Toast",
    },
    order: 11,
    isFree: false,
    components: ["NumberField", "Slider", "ScrollArea", "Toast"],
  },
  {
    slug: "12-capstone",
    title: { en: "Capstone — Ship Your Library", ja: "キャップストーン — ライブラリ公開" },
    description: {
      en: "Bundling, Documentation, Testing, npm Publish",
      ja: "バンドル、ドキュメント、テスト、npm公開",
    },
    order: 12,
    isFree: false,
    components: [],
  },
];

export type Locale = "en" | "ja";
export const locales: Locale[] = ["en", "ja"];
export const defaultLocale: Locale = "en";
