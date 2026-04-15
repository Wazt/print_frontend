import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKENS_PATH = resolve(__dirname, "../styles/tokens.css");

// ─── Color math helpers ────────────────────────────────────────────────
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function relativeLuminance([r, g, b]) {
  const [R, G, B] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(fgHex, bgHex) {
  const L1 = relativeLuminance(hexToRgb(fgHex));
  const L2 = relativeLuminance(hexToRgb(bgHex));
  const [bright, dark] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (bright + 0.05) / (dark + 0.05);
}

// ─── Parse tokens.css into two scopes ─────────────────────────────────
function parseTokens(css) {
  const result = { light: {}, dark: {} };
  // Match :root { ... } (first block, before .dark)
  const lightMatch = css.match(/:root\s*\{([\s\S]*?)\}/);
  const darkMatch = css.match(/\.dark\s*\{([\s\S]*?)\}/);

  const parseBlock = (blockText) => {
    const out = {};
    const re = /--([a-z0-9-]+)\s*:\s*([^;]+);/gi;
    let m;
    while ((m = re.exec(blockText)) !== null) {
      out[m[1]] = m[2].trim();
    }
    return out;
  };

  if (lightMatch) result.light = parseBlock(lightMatch[1]);
  if (darkMatch) result.dark = parseBlock(darkMatch[1]);
  return result;
}

// Inherit dark values from light mode for keys not redeclared
function resolveDark(light, dark) {
  return { ...light, ...dark };
}

// Only hex colors (skip rgba() which would need compositing)
function isHex(value) {
  return /^#[0-9A-Fa-f]{3,6}$/.test(value);
}

// ─── Required contrast thresholds per WCAG 2.1 AA ─────────────────────
const AA_NORMAL = 4.5; // Normal text
const AA_LARGE = 3.0; // Large text (>= 18pt or 14pt bold) + UI components
const AA_UI = 3.0;

// ─── Text / background pairs to assert ────────────────────────────────
// { fg, bg, minRatio, label }
const LIGHT_PAIRS = [
  { fg: "text", bg: "bg", min: AA_NORMAL, label: "primary text on page bg" },
  { fg: "text", bg: "surface", min: AA_NORMAL, label: "primary text on surface" },
  { fg: "text", bg: "surface-2", min: AA_NORMAL, label: "primary text on surface-2" },
  { fg: "text-2", bg: "bg", min: AA_NORMAL, label: "secondary text on page bg" },
  { fg: "text-2", bg: "surface", min: AA_NORMAL, label: "secondary text on surface" },
  { fg: "text-3", bg: "bg", min: AA_LARGE, label: "muted text on page bg (large/UI)" },
  { fg: "text-3", bg: "surface", min: AA_LARGE, label: "muted text on surface (large/UI)" },
  { fg: "brand-fg", bg: "brand", min: AA_NORMAL, label: "brand button text" },
  { fg: "accent-fg", bg: "accent", min: AA_NORMAL, label: "accent button text" },
  { fg: "accent", bg: "accent-bg", min: AA_UI, label: "accent on accent-bg (UI component)" },
  { fg: "success", bg: "success-bg", min: AA_UI, label: "success on success-bg" },
  { fg: "warning", bg: "warning-bg", min: AA_UI, label: "warning on warning-bg" },
  { fg: "danger", bg: "danger-bg", min: AA_UI, label: "danger on danger-bg" },
];

const DARK_PAIRS = [
  { fg: "text", bg: "bg", min: AA_NORMAL, label: "[dark] primary text on page bg" },
  { fg: "text", bg: "surface", min: AA_NORMAL, label: "[dark] primary text on surface" },
  { fg: "text", bg: "surface-2", min: AA_NORMAL, label: "[dark] primary text on surface-2" },
  { fg: "text-2", bg: "surface", min: AA_NORMAL, label: "[dark] secondary text on surface" },
  { fg: "text-3", bg: "surface", min: AA_LARGE, label: "[dark] muted text on surface (large/UI)" },
  { fg: "brand-fg", bg: "brand", min: AA_NORMAL, label: "[dark] brand button text" },
];

// ─── Suite ────────────────────────────────────────────────────────────
let tokens;
let dark;
beforeAll(() => {
  const css = readFileSync(TOKENS_PATH, "utf-8");
  tokens = parseTokens(css);
  dark = resolveDark(tokens.light, tokens.dark);
});

describe("Design tokens — parsing", () => {
  it("parses a non-empty light-mode block", () => {
    expect(Object.keys(tokens.light).length).toBeGreaterThan(20);
  });

  it("parses a non-empty dark-mode block", () => {
    expect(Object.keys(tokens.dark).length).toBeGreaterThan(10);
  });

  it("light mode defines all semantic colors", () => {
    const required = [
      "bg",
      "surface",
      "surface-2",
      "text",
      "text-2",
      "text-3",
      "brand",
      "brand-fg",
      "accent",
      "accent-fg",
      "success",
      "warning",
      "danger",
    ];
    for (const key of required) {
      expect(tokens.light[key]).toBeDefined();
    }
  });
});

describe("Design tokens — WCAG 2.1 AA contrast (light mode)", () => {
  for (const pair of LIGHT_PAIRS) {
    it(`${pair.label} >= ${pair.min}:1`, () => {
      const fg = tokens.light[pair.fg];
      const bg = tokens.light[pair.bg];
      expect(fg).toBeDefined();
      expect(bg).toBeDefined();

      // Skip pairs with rgba() values (can't compute without alpha compositing)
      if (!isHex(fg) || !isHex(bg)) {
        return;
      }

      const ratio = contrastRatio(fg, bg);
      // Round to 2 decimals for readable error messages
      const rounded = Math.round(ratio * 100) / 100;
      if (rounded < pair.min) {
        throw new Error(
          `${pair.label}: ${fg} on ${bg} = ${rounded}:1 (needs ${pair.min}:1)`
        );
      }
    });
  }
});

describe("Design tokens — WCAG 2.1 AA contrast (dark mode)", () => {
  for (const pair of DARK_PAIRS) {
    it(`${pair.label} >= ${pair.min}:1`, () => {
      const fg = dark[pair.fg];
      const bg = dark[pair.bg];
      expect(fg).toBeDefined();
      expect(bg).toBeDefined();

      if (!isHex(fg) || !isHex(bg)) {
        return;
      }

      const ratio = contrastRatio(fg, bg);
      const rounded = Math.round(ratio * 100) / 100;
      if (rounded < pair.min) {
        throw new Error(
          `${pair.label}: ${fg} on ${bg} = ${rounded}:1 (needs ${pair.min}:1)`
        );
      }
    });
  }
});

describe("Design tokens — structure guarantees", () => {
  it("brand and accent have foreground pairs defined", () => {
    expect(tokens.light["brand-fg"]).toBeDefined();
    expect(tokens.light["accent-fg"]).toBeDefined();
  });

  it("every semantic status has a matching -bg variant", () => {
    for (const key of ["success", "warning", "danger", "info", "neutral"]) {
      expect(tokens.light[key]).toBeDefined();
      expect(tokens.light[`${key}-bg`]).toBeDefined();
    }
  });

  it("dark mode flips bg/surface (bg is darker than surface in dark)", () => {
    // In light: bg is lighter than surface? No, bg=#F8FAFC and surface=#FFFFFF — surface is slightly brighter
    // In dark: bg should be darker than surface
    const bgHex = dark.bg;
    const surfaceHex = dark.surface;
    if (isHex(bgHex) && isHex(surfaceHex)) {
      const bgL = relativeLuminance(hexToRgb(bgHex));
      const surfaceL = relativeLuminance(hexToRgb(surfaceHex));
      expect(bgL).toBeLessThan(surfaceL);
    }
  });
});
