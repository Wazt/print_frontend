import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ThemeSwitcher() {
  const { isDark, toggle } = useTheme();
  const { t } = useLanguage();
  const isFr = t("lang") === "fr";

  const label = isDark
    ? isFr
      ? "Passer en mode clair"
      : "Switch to light mode"
    : isFr
    ? "Passer en mode sombre"
    : "Switch to dark mode";

  return (
    <button
      onClick={toggle}
      type="button"
      className="h-9 w-9 rounded-[var(--radius)] flex items-center justify-center text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] transition-colors"
      title={label}
      aria-label={label}
      aria-pressed={isDark}
    >
      {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
}
