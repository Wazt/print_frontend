import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeSwitcher() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="w-[34px] h-[34px] rounded-[10px] border border-[var(--ob-brd)] bg-[var(--ob-surf2)] flex items-center justify-center text-[var(--ob-txm)] hover:text-[var(--ob-tx)] hover:border-[var(--ob-brd2)] transition"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
