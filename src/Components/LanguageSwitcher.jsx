import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="flex items-center rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-0.5 h-9">
      <button
        onClick={() => setLanguage("fr")}
        className={`px-2.5 h-8 rounded-[var(--radius-sm)] text-[11px] font-semibold transition-colors ${
          language === "fr"
            ? "bg-[var(--brand)] text-[var(--brand-fg)]"
            : "text-[var(--text-3)] hover:text-[var(--text)]"
        }`}
      >
        FR
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`px-2.5 h-8 rounded-[var(--radius-sm)] text-[11px] font-semibold transition-colors ${
          language === "en"
            ? "bg-[var(--brand)] text-[var(--brand-fg)]"
            : "text-[var(--text-3)] hover:text-[var(--text)]"
        }`}
      >
        EN
      </button>
    </div>
  );
}
