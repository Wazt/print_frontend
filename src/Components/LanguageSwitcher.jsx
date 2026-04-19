import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const isFr = language === "fr";

  return (
    <div
      role="group"
      aria-label={isFr ? "Selecteur de langue" : "Language selector"}
      className="flex items-center rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-0.5 h-9"
    >
      <button
        type="button"
        onClick={() => setLanguage("fr")}
        aria-pressed={language === "fr"}
        aria-label={isFr ? "Francais (actif)" : "Switch to French"}
        className={`px-2.5 h-8 rounded-[var(--radius-sm)] text-[11px] font-semibold transition-colors ${
          language === "fr"
            ? "bg-[var(--brand)] text-[var(--brand-fg)]"
            : "text-[var(--text-3)] hover:text-[var(--text)]"
        }`}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        aria-label={isFr ? "Passer a l'anglais" : "English (active)"}
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
