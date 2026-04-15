import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeSwitcher() {
  const { isDark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="h-9 w-9 rounded-[var(--radius)] flex items-center justify-center text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] transition-colors"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
