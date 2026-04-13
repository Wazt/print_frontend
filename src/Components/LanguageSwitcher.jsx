import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center rounded-[8px] border border-[var(--ob-brd)] bg-[var(--ob-surf2)] p-[2px] gap-[2px]">
      <button
        onClick={() => setLanguage("fr")}
        className={`px-2.5 py-1 rounded-[6px] text-[11px] font-semibold transition-all ${
          language === "fr"
            ? "bg-[var(--ob-p)] text-white"
            : "text-[var(--ob-txd)] hover:text-[var(--ob-tx)]"
        }`}
      >
        FR
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`px-2.5 py-1 rounded-[6px] text-[11px] font-semibold transition-all ${
          language === "en"
            ? "bg-[var(--ob-p)] text-white"
            : "text-[var(--ob-txd)] hover:text-[var(--ob-tx)]"
        }`}
      >
        EN
      </button>
    </div>
  );
}
