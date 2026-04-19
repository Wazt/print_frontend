import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Printer, User, Mail, Phone, Building2, ArrowRight, CheckCircle2,
  Factory, Palette, Briefcase, GraduationCap, Landmark, HelpCircle,
  Info,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/Components/LanguageSwitcher";
import { Button, FormField, Input } from "@/Components/primitives";
import OnboardingShell, {
  QuestionTitle, OptionPill,
} from "./Onboarding/OnboardingShell";
import { COMPANY_TYPES } from "@/lib/fixtures/companyTypes";
import { MOCK_COMPANIES } from "@/lib/fixtures/contacts";

// Icon per company type — gives the pill chips visual weight
const TYPE_ICONS = {
  IMPRIMERIE: Factory,
  AGENCE_COMMUNICATION: Palette,
  FREELANCE: Briefcase,
  CORPORATE: Building2,
  EDUCATION: GraduationCap,
  AUTRE: HelpCircle,
};

// ───────────────────────────────────────────────────────────
// Step 1 — "Qui etes-vous ?"
// ───────────────────────────────────────────────────────────
function Step1({ form, update, isFr }) {
  return (
    <>
      <QuestionTitle
        subtitle={
          isFr
            ? "Quelques infos pour personnaliser votre espace"
            : "A few details to personalize your workspace"
        }
      >
        {isFr ? "Qui etes-vous ?" : "Who are you?"}
      </QuestionTitle>

      <div className="space-y-8">
        {/* Full name */}
        <FormField
          label={isFr ? "Nom complet" : "Full name"}
          htmlFor="full_name"
          required
        >
          <div className="relative">
            <User
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-4)]"
              aria-hidden="true"
            />
            <Input
              id="full_name"
              value={form.full_name}
              onChange={(e) => update("full_name", e.target.value)}
              placeholder={isFr ? "Prenom Nom" : "First Last"}
              required
              className="pl-11 w-full h-12 rounded-full text-[15px]"
            />
          </div>
        </FormField>

        {/* Phone */}
        <FormField
          label={isFr ? "Telephone" : "Phone"}
          htmlFor="phone"
          required
        >
          <div className="relative">
            <Phone
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-4)]"
              aria-hidden="true"
            />
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+213 555 11 22 33"
              required
              className="pl-11 w-full h-12 rounded-full text-[15px]"
            />
          </div>
        </FormField>

        {/* Company type as pill chips */}
        <div>
          <label className="block text-[13px] font-medium text-[var(--text-2)] mb-3">
            {isFr ? "Je suis..." : "I am a..."}{" "}
            <span className="text-[var(--danger)]">*</span>
          </label>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {COMPANY_TYPES.map((ct) => {
              const Icon = TYPE_ICONS[ct.value] || HelpCircle;
              return (
                <OptionPill
                  key={ct.value}
                  active={form.company_type === ct.value}
                  onClick={() => update("company_type", ct.value)}
                  icon={Icon}
                >
                  {isFr ? ct.labelFr : ct.labelEn}
                </OptionPill>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// ───────────────────────────────────────────────────────────
// Step 2 — "Votre entreprise"
// ───────────────────────────────────────────────────────────
function Step2({ form, update, isFr, onSelectCompany }) {
  const [focused, setFocused] = useState(false);
  const matches =
    form.company_name.length > 1
      ? MOCK_COMPANIES.filter(
          (c) =>
            !c.isDuplicateOf &&
            c.name.toLowerCase().includes(form.company_name.toLowerCase())
        ).slice(0, 4)
      : [];

  return (
    <>
      <QuestionTitle
        subtitle={
          isFr
            ? "Nous verifions les doublons avant la creation definitive"
            : "We'll check for duplicates before finalizing"
        }
      >
        {isFr ? "Parlez-nous de votre entreprise" : "About your company"}
      </QuestionTitle>

      <div className="space-y-6">
        {/* Company name with autocomplete */}
        <FormField
          label={isFr ? "Nom de l'entreprise" : "Company name"}
          htmlFor="company_name"
          required
          hint={
            isFr
              ? "Commencez a taper pour rechercher les entreprises existantes"
              : "Start typing to search existing companies"
          }
        >
          <div className="relative">
            <Building2
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-4)]"
              aria-hidden="true"
            />
            <Input
              id="company_name"
              value={form.company_name}
              onChange={(e) => update("company_name", e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 200)}
              placeholder={
                isFr ? "Nom de votre entreprise..." : "Your company name..."
              }
              required
              className="pl-11 w-full h-12 rounded-full text-[15px]"
            />
            {focused && matches.length > 0 && (
              <div className="absolute z-10 left-0 right-0 mt-2 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lift)] overflow-hidden">
                <div className="px-4 py-2.5 text-[11px] uppercase tracking-wider text-[var(--text-3)] font-semibold border-b border-[var(--border)]">
                  {isFr ? "Entreprises existantes" : "Existing companies"}
                </div>
                {matches.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onSelectCompany(m);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-[var(--surface-2)] flex items-center gap-2.5"
                  >
                    <Building2
                      size={14}
                      className="text-[var(--text-3)]"
                      aria-hidden="true"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-[var(--text)] truncate">
                        {m.name}
                      </div>
                      <div className="text-[11px] text-[var(--text-3)] truncate">
                        {m.address}
                      </div>
                    </div>
                  </button>
                ))}
                <div className="px-4 py-2.5 bg-[var(--warning-bg)] text-[11px] text-[var(--warning)] flex items-start gap-2">
                  <Info size={12} className="mt-0.5 flex-shrink-0" />
                  <span>
                    {isFr
                      ? "Vous ne trouvez pas ? Saisissez un nouveau nom. Un admin sera alerte pour verifier."
                      : "Don't see yours? Type a new name. An admin will be alerted to check."}
                  </span>
                </div>
              </div>
            )}
          </div>
        </FormField>

        {/* Address — optional */}
        <FormField
          label={isFr ? "Adresse (optionnel)" : "Address (optional)"}
          htmlFor="address"
        >
          <div className="relative">
            <Input
              id="address"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder={
                isFr ? "Ville ou adresse complete" : "City or full address"
              }
              className="w-full h-12 rounded-full text-[15px] pl-5"
            />
          </div>
        </FormField>

        {/* Terms */}
        <label className="flex items-start gap-2.5 cursor-pointer text-[13px] text-[var(--text-2)] pt-2 justify-center">
          <input
            type="checkbox"
            checked={form.agreed}
            onChange={(e) => update("agreed", e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[var(--border-2)] accent-[var(--accent)] flex-shrink-0"
          />
          <span className="max-w-md">
            {isFr ? "J'accepte les " : "I agree to the "}
            <a href="#" className="text-[var(--accent)] hover:underline">
              {isFr ? "conditions" : "terms"}
            </a>
            {isFr ? " et la " : " and "}
            <a href="#" className="text-[var(--accent)] hover:underline">
              {isFr ? "politique de confidentialite" : "privacy policy"}
            </a>
          </span>
        </label>
      </div>
    </>
  );
}

// ───────────────────────────────────────────────────────────
// Entry — Split-screen email capture (Obat-inspired)
// ───────────────────────────────────────────────────────────
function EntryLayout({ email, setEmail, onContinue, onOAuth, isFr, navigate }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      {/* LEFT — brand pitch (soft light panel) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--accent-bg)] flex-col p-12 justify-center relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[var(--accent)]/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />

        <div className="relative max-w-md">
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--brand)] flex items-center justify-center">
              <Printer
                size={20}
                className="text-[var(--brand-fg)]"
                aria-hidden="true"
              />
            </div>
            <span className="text-[22px] font-semibold tracking-tight text-[var(--text)]">
              PrintFlow
            </span>
          </div>

          <h1 className="text-[28px] md:text-[32px] font-semibold tracking-tight leading-tight text-[var(--text)] mb-4">
            {isFr
              ? "L'outil qui simplifie la vie des imprimeurs et agences"
              : "The tool that simplifies life for printers and agencies"}
          </h1>
          <p className="text-[15px] text-[var(--text-2)] leading-relaxed mb-10">
            {isFr
              ? "Gestion des commandes, contacts multi-entreprises, devis et facturation — tout dans une plateforme unifiee."
              : "Order management, multi-company contacts, quotes and invoicing — all in one unified platform."}
          </p>

          <div className="bg-[var(--surface)]/50 backdrop-blur-sm border border-[var(--accent)]/10 rounded-[var(--radius-xl)] p-5 shadow-[var(--shadow-card)]">
            <div className="space-y-3">
              {[
                isFr
                  ? "Inscription en 30 secondes"
                  : "Signup in 30 seconds",
                isFr
                  ? "Gestion multi-entreprises pour freelances"
                  : "Multi-company management for freelancers",
                isFr
                  ? "Reseau d'imprimeurs et infographes"
                  : "Network of printers and designers",
                isFr
                  ? "Facturation et paiements integres"
                  : "Built-in invoicing and payments",
              ].map((feat) => (
                <div
                  key={feat}
                  className="flex items-center gap-2.5 text-[13px] text-[var(--text-2)]"
                >
                  <CheckCircle2
                    size={16}
                    className="text-[var(--accent)] flex-shrink-0"
                    aria-hidden="true"
                  />
                  {feat}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-12 text-[12px] text-[var(--text-3)]">
          © 2026 PrintFlow · Built by Axentis
        </div>
      </div>

      {/* RIGHT — email + OAuth */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-6">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--brand)] flex items-center justify-center">
              <Printer size={16} className="text-[var(--brand-fg)]" />
            </div>
            <span className="font-semibold text-[var(--text)]">PrintFlow</span>
          </div>
          <div className="ml-auto flex items-center gap-3 text-[13px] text-[var(--text-3)]">
            <span className="hidden sm:inline">
              {isFr ? "Deja un compte ?" : "Already have an account?"}
            </span>
            <button
              type="button"
              onClick={() => navigate("/auth/login")}
              className="text-[var(--accent)] font-medium hover:underline"
            >
              {isFr ? "Se connecter" : "Log in"}
            </button>
            <span className="ml-2">
              <LanguageSwitcher />
            </span>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-sm">
            <h2 className="text-[30px] font-semibold text-[var(--text)] tracking-tight text-center">
              {isFr ? "Creez votre compte" : "Create your account"}
            </h2>
            <p className="mt-1.5 text-[14px] text-[var(--text-3)] text-center">
              {isFr ? "Gratuitement, en 30 secondes" : "Free, in 30 seconds"}
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onContinue();
              }}
              className="mt-8 space-y-3"
            >
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-4)]"
                  aria-hidden="true"
                />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    isFr
                      ? "Entrez votre adresse email"
                      : "Enter your email address"
                  }
                  required
                  autoFocus
                  className="pl-11 w-full h-14 rounded-full text-[15px]"
                />
              </div>

              <button
                type="submit"
                disabled={!email.includes("@")}
                className={`w-full h-14 rounded-full font-semibold text-[15px] inline-flex items-center justify-center gap-2 transition-all ${
                  email.includes("@")
                    ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-2)] hover:shadow-[var(--shadow-lift)]"
                    : "bg-[var(--accent)] text-white opacity-60 cursor-not-allowed"
                }`}
              >
                {isFr ? "Je profite de l'offre" : "Get started"}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[var(--bg)] px-3 text-[var(--text-3)]">
                  {isFr ? "Ou" : "Or"}
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => onOAuth("Google")}
                className="w-full h-12 rounded-full border border-[var(--border-2)] bg-[var(--surface)] hover:border-[var(--text-3)] text-[var(--text)] text-[14px] font-medium inline-flex items-center justify-center gap-2.5 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09A6.58 6.58 0 0 1 5.47 12c0-.72.13-1.43.36-2.09V7.07H2.18A10.99 10.99 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A10.99 10.99 0 0 0 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {isFr ? "S'inscrire avec Google" : "Continue with Google"}
              </button>

              <button
                type="button"
                onClick={() => onOAuth("Microsoft")}
                className="w-full h-12 rounded-full border border-[var(--border-2)] bg-[var(--surface)] hover:border-[var(--text-3)] text-[var(--text)] text-[14px] font-medium inline-flex items-center justify-center gap-2.5 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#F25022" d="M1 1h10v10H1z" />
                  <path fill="#7FBA00" d="M13 1h10v10H13z" />
                  <path fill="#00A4EF" d="M1 13h10v10H1z" />
                  <path fill="#FFB900" d="M13 13h10v10H13z" />
                </svg>
                {isFr ? "S'inscrire avec Microsoft" : "Continue with Microsoft"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Main component
// ───────────────────────────────────────────────────────────
export default function SignupPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isFr = t("lang") === "fr";

  const [step, setStep] = useState("entry"); // 'entry' | '1' | '2'
  const [form, setForm] = useState({
    email: "",
    full_name: "",
    phone: "",
    company_type: "",
    company_name: "",
    address: "",
    agreed: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleOAuth = (provider) => {
    toast.info(
      isFr
        ? `OAuth ${provider} — disponible en phase A (backend requis)`
        : `${provider} OAuth — coming in phase A (backend required)`
    );
  };

  // Entry screen
  if (step === "entry") {
    return (
      <EntryLayout
        email={form.email}
        setEmail={(v) => update("email", v)}
        onContinue={() => {
          if (!form.email.includes("@")) {
            toast.error(isFr ? "Email invalide" : "Invalid email");
            return;
          }
          setStep("1");
        }}
        onOAuth={handleOAuth}
        isFr={isFr}
        navigate={navigate}
      />
    );
  }

  // Step 1 validation
  const step1Valid =
    form.full_name.trim().length > 1 &&
    form.phone.trim().length > 0 &&
    Boolean(form.company_type);

  // Step 2 validation
  const step2Valid =
    form.company_name.trim().length > 1 && form.agreed;

  const handleFinalSubmit = () => {
    if (!step2Valid) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/signup/verify", {
        state: { email: form.email, fullName: form.full_name },
      });
    }, 500);
  };

  return (
    <>
      <Toaster position="top-right" />
      <OnboardingShell
        stepNumber={step === "1" ? 1 : 2}
        totalSteps={2}
        onBack={() => {
          if (step === "1") setStep("entry");
          else setStep("1");
        }}
        onContinue={() => {
          if (step === "1") {
            if (!step1Valid) return;
            setStep("2");
          } else {
            handleFinalSubmit();
          }
        }}
        canContinue={step === "1" ? step1Valid : step2Valid}
        continueLabel={
          step === "2"
            ? isFr ? "Creer mon compte" : "Create my account"
            : undefined
        }
        loading={isSubmitting}
      >
        {step === "1" && <Step1 form={form} update={update} isFr={isFr} />}
        {step === "2" && (
          <Step2
            form={form}
            update={update}
            isFr={isFr}
            onSelectCompany={(m) => {
              update("company_name", m.name);
              toast.success(
                isFr
                  ? `"${m.name}" selectionnee`
                  : `"${m.name}" selected`
              );
            }}
          />
        )}
      </OnboardingShell>
    </>
  );
}
