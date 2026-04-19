import React from "react";
import { ChevronLeft, ChevronRight, Printer } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/Components/LanguageSwitcher";

/**
 * OnboardingShell — wrapper for the Obat-style 7-step onboarding.
 *
 * Props:
 *   stepNumber: 1..7 (undefined for pre-step entry)
 *   totalSteps: 7
 *   onBack: () => void (or null = disabled)
 *   onContinue: () => void (or null = hidden)
 *   canContinue: boolean
 *   continueLabel?: string
 *   children: JSX (the question body)
 */
export default function OnboardingShell({
  stepNumber,
  totalSteps = 7,
  onBack,
  onContinue,
  canContinue = false,
  continueLabel,
  children,
  loading = false,
}) {
  const { t } = useLanguage();
  const isFr = t("lang") === "fr";
  const progress = stepNumber ? (stepNumber / totalSteps) * 100 : 0;
  const label = continueLabel || (isFr ? "Continuer" : "Continue");

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      {/* Top progress bar */}
      <div className="relative w-full">
        <div className="h-1 bg-[var(--surface-2)]">
          <div
            className="h-full transition-all duration-[var(--dur-slow)] ease-out"
            style={{
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, var(--accent), var(--accent-2))",
            }}
          />
        </div>
        <div className="absolute top-4 right-6 flex items-center gap-3">
          <LanguageSwitcher />
          {stepNumber && (
            <span className="text-[13px] font-mono font-semibold text-[var(--text-2)] tabular-nums">
              {stepNumber}/{totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Step body (centered column) */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[680px]">{children}</div>
      </div>

      {/* Bottom nav — back + continue */}
      {(onBack || onContinue) && (
        <div className="w-full pb-8 px-6">
          <div className="max-w-[680px] mx-auto flex items-center justify-center gap-4">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                aria-label={isFr ? "Retour" : "Back"}
                className="w-12 h-12 rounded-full border border-[var(--border-2)] bg-[var(--surface)] flex items-center justify-center text-[var(--text-2)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
            )}
            {onContinue && (
              <button
                type="button"
                onClick={onContinue}
                disabled={!canContinue || loading}
                className={`h-12 px-8 min-w-[240px] rounded-full font-semibold text-[15px] inline-flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] ${
                  canContinue && !loading
                    ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-2)] hover:shadow-[var(--shadow-lift)]"
                    : "bg-[var(--accent)] text-white opacity-60 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {label}
                    <ChevronRight size={16} aria-hidden="true" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Brand logo bottom-left */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2 opacity-70">
        <div className="w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--brand)] flex items-center justify-center">
          <Printer size={14} className="text-[var(--brand-fg)]" aria-hidden="true" />
        </div>
        <span className="text-[14px] font-semibold tracking-tight text-[var(--text)]">
          PrintFlow
        </span>
      </div>
    </div>
  );
}

/**
 * Question heading — the big H1 per step.
 */
export function QuestionTitle({ children, subtitle }) {
  return (
    <div className="text-center mb-10">
      <h1 className="text-[28px] md:text-[32px] font-semibold text-[var(--text)] tracking-tight leading-tight">
        {children}
      </h1>
      {subtitle && (
        <p className="mt-3 text-[14px] text-[var(--text-3)]">{subtitle}</p>
      )}
    </div>
  );
}

/**
 * OptionPill — single-select or multi-select pill-shaped option.
 */
export function OptionPill({ active, onClick, children, size = "md", icon: Icon }) {
  const sizes = {
    sm: "h-9 px-4 text-[13px]",
    md: "h-11 px-5 text-[14px]",
    lg: "h-12 px-6 text-[15px]",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 ${sizes[size]} rounded-full border transition-all focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] ${
        active
          ? "bg-[var(--accent-bg)] border-[var(--accent)] text-[var(--accent)] font-medium"
          : "bg-[var(--surface)] border-[var(--border-2)] text-[var(--text-2)] hover:border-[var(--text-3)] hover:text-[var(--text)]"
      }`}
    >
      {Icon && <Icon size={15} aria-hidden="true" />}
      {children}
    </button>
  );
}

/**
 * OptionCard — larger card-style option (for audience step).
 */
export function OptionCard({ active, onClick, title, description, icon: Icon, image }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left w-full rounded-[var(--radius-xl)] border-2 p-6 transition-all focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] ${
        active
          ? "bg-[var(--accent-bg)] border-[var(--accent)]"
          : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-2)]"
      }`}
    >
      <div className="flex items-start gap-4">
        {Icon && (
          <div
            className={`w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center flex-shrink-0 transition-colors ${
              active
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--surface-2)] text-[var(--text-2)]"
            }`}
          >
            <Icon size={22} aria-hidden="true" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div
            className={`text-[16px] font-semibold tracking-tight ${
              active ? "text-[var(--accent)]" : "text-[var(--text)]"
            }`}
          >
            {title}
          </div>
          {description && (
            <p className="mt-1.5 text-[13px] text-[var(--text-3)] leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
