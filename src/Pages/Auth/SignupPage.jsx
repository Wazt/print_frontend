import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Printer, User, Mail, Phone, Building2, ArrowRight, CheckCircle2, Info,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/Components/LanguageSwitcher";
import { Button, FormField, Input, Select } from "@/Components/primitives";
import { COMPANY_TYPES } from "@/lib/fixtures/companyTypes";
import { MOCK_COMPANIES } from "@/lib/fixtures/contacts";

function CompanyAutocomplete({ value, onChange, isFr, onSelectExisting }) {
  const [focused, setFocused] = useState(false);
  const matches = value.length > 1
    ? MOCK_COMPANIES.filter((c) =>
        c.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 4)
    : [];

  return (
    <div className="relative">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        placeholder={isFr ? "Nom de votre entreprise..." : "Your company name..."}
      />
      {focused && matches.length > 0 && (
        <div className="absolute z-10 left-0 right-0 mt-1 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] shadow-[var(--shadow-lift)] overflow-hidden">
          <div className="px-3 py-2 text-[11px] uppercase tracking-wider text-[var(--text-3)] font-semibold border-b border-[var(--border)]">
            {isFr ? "Entreprises existantes" : "Existing companies"}
          </div>
          {matches.map((m) => (
            <button
              key={m.id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onSelectExisting(m);
              }}
              className="w-full text-left px-3 py-2 hover:bg-[var(--surface-2)] flex items-center gap-2"
            >
              <Building2 size={14} className="text-[var(--text-3)]" />
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
          <div className="px-3 py-2 bg-[var(--warning-bg)] text-[11px] text-[var(--warning)] flex items-start gap-2">
            <Info size={12} className="mt-0.5 flex-shrink-0" />
            <span>
              {isFr
                ? "Vous ne trouvez pas ? Saisissez un nouveau nom. Un admin sera alerte pour verifier les doublons."
                : "Don't see yours? Type a new name. An admin will be alerted to check for duplicates."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isFr = t("lang") === "fr";

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_type: "",
    company_name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: typeof e === "string" ? e : e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) {
      toast.error(isFr ? "Acceptez les conditions" : "Please accept the terms");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/signup/verify", { state: { email: form.email, fullName: form.full_name } });
    }, 500);
  };

  const handleOAuth = (provider) => {
    toast.info(
      isFr
        ? `OAuth ${provider} — disponible en phase A (backend requis)`
        : `${provider} OAuth — coming in phase A (backend required)`
    );
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      {/* Left — branding (always dark) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] text-white flex-col p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-sky-500/5 blur-3xl" />

        <div className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[var(--radius)] bg-sky-500 flex items-center justify-center">
            <Printer size={18} className="text-white" aria-hidden="true" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">PrintFlow</span>
        </div>

        <div className="relative mt-auto max-w-md">
          <h1 className="text-4xl font-semibold tracking-tight leading-tight mb-4">
            {isFr
              ? "Rejoignez le reseau qui connecte agences, freelances et imprimeurs."
              : "Join the network connecting agencies, freelances, and printers."}
          </h1>
          <p className="text-[15px] text-white/60 leading-relaxed mb-8">
            {isFr
              ? "Creez votre compte en 2 minutes. Gerez vos commandes, contacts et facturation dans une plateforme unifiee."
              : "Create your account in 2 minutes. Manage orders, contacts, and invoicing in one unified platform."}
          </p>

          <div className="space-y-3">
            {[
              isFr ? "Compte pret en moins de 2 minutes" : "Account ready in under 2 minutes",
              isFr ? "Gestion des contacts multi-entreprises" : "Multi-company contact management",
              isFr ? "Integration reseau infographes & imprimeurs" : "Designer & printer network",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2.5 text-[14px] text-white/80">
                <CheckCircle2 size={16} className="text-sky-400 flex-shrink-0" aria-hidden="true" />
                {feat}
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-[12px] text-white/40 mt-10">
          © 2026 PrintFlow · Built by Axentis
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex items-center justify-between p-6">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-[var(--radius)] bg-[var(--brand)] flex items-center justify-center">
              <Printer size={16} className="text-[var(--brand-fg)]" aria-hidden="true" />
            </div>
            <span className="font-semibold text-[var(--text)]">PrintFlow</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher />
          </div>
        </header>

        <div className="flex-1 flex items-start justify-center p-6 pt-2">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <h2 className="text-3xl font-semibold text-[var(--text)] tracking-tight">
                {isFr ? "Creer votre compte" : "Create your account"}
              </h2>
              <p className="mt-2 text-[14px] text-[var(--text-3)]">
                {isFr ? "Deja client ? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => navigate("/auth/login")}
                  className="font-medium text-[var(--accent)] hover:underline"
                >
                  {isFr ? "Se connecter" : "Log in"}
                </button>
              </p>
            </div>

            {/* OAuth */}
            <div className="space-y-2 mb-6">
              <Button
                variant="outline"
                size="lg"
                className="w-full !justify-center"
                onClick={() => handleOAuth("Google")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09A6.58 6.58 0 0 1 5.47 12c0-.72.13-1.43.36-2.09V7.07H2.18A10.99 10.99 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A10.99 10.99 0 0 0 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {isFr ? "Continuer avec Google" : "Continue with Google"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full !justify-center"
                onClick={() => handleOAuth("Microsoft")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#F25022" d="M1 1h10v10H1z" />
                  <path fill="#7FBA00" d="M13 1h10v10H13z" />
                  <path fill="#00A4EF" d="M1 13h10v10H1z" />
                  <path fill="#FFB900" d="M13 13h10v10H13z" />
                </svg>
                {isFr ? "Continuer avec Microsoft" : "Continue with Microsoft"}
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[var(--bg)] px-3 text-[var(--text-3)]">
                  {isFr ? "ou par email" : "or by email"}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[var(--text-3)] font-semibold mb-3">
                  {isFr ? "Vos infos" : "Your info"}
                </div>
                <div className="space-y-4">
                  <FormField label={isFr ? "Nom complet" : "Full name"} htmlFor="full_name" required>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)]" aria-hidden="true" />
                      <Input
                        id="full_name"
                        value={form.full_name}
                        onChange={update("full_name")}
                        placeholder="Jane Doe"
                        required
                        className="pl-9 w-full"
                      />
                    </div>
                  </FormField>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField label="Email" htmlFor="email" required>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)]" aria-hidden="true" />
                        <Input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={update("email")}
                          placeholder="jane@agence.dz"
                          required
                          className="pl-9 w-full"
                        />
                      </div>
                    </FormField>
                    <FormField label={isFr ? "Telephone" : "Phone"} htmlFor="phone" required>
                      <div className="relative">
                        <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)]" aria-hidden="true" />
                        <Input
                          id="phone"
                          type="tel"
                          value={form.phone}
                          onChange={update("phone")}
                          placeholder="+213 555 11 22 33"
                          required
                          className="pl-9 w-full"
                        />
                      </div>
                    </FormField>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-wider text-[var(--text-3)] font-semibold mb-3 mt-5">
                  {isFr ? "Votre entreprise" : "Your company"}
                </div>
                <div className="space-y-4">
                  <FormField
                    label={isFr ? "Type d'entreprise" : "Company type"}
                    htmlFor="company_type"
                    required
                  >
                    <Select
                      id="company_type"
                      value={form.company_type}
                      onChange={update("company_type")}
                      required
                    >
                      <option value="">
                        {isFr ? "Selectionnez..." : "Select..."}
                      </option>
                      {COMPANY_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {isFr ? t.labelFr : t.labelEn}
                        </option>
                      ))}
                    </Select>
                  </FormField>
                  <FormField
                    label={isFr ? "Nom de l'entreprise" : "Company name"}
                    htmlFor="company_name"
                    required
                    hint={
                      isFr
                        ? "Recherche automatique dans les entreprises existantes"
                        : "Autocomplete from existing companies"
                    }
                  >
                    <CompanyAutocomplete
                      value={form.company_name}
                      onChange={update("company_name")}
                      isFr={isFr}
                      onSelectExisting={(m) => {
                        setForm((f) => ({
                          ...f,
                          company_name: m.name,
                          company_type: m.type,
                        }));
                        toast.success(
                          isFr
                            ? `"${m.name}" selectionnee`
                            : `"${m.name}" selected`
                        );
                      }}
                    />
                  </FormField>
                </div>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer mt-5 text-[13px] text-[var(--text-2)]">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[var(--border-2)] accent-[var(--accent)] flex-shrink-0"
                />
                <span>
                  {isFr ? "J'accepte les " : "I agree to the "}
                  <a href="#" className="text-[var(--accent)] hover:underline">
                    {isFr ? "conditions d'utilisation" : "terms"}
                  </a>
                  {isFr ? " et la " : " and "}
                  <a href="#" className="text-[var(--accent)] hover:underline">
                    {isFr ? "politique de confidentialite" : "privacy policy"}
                  </a>
                </span>
              </label>

              <Button
                type="submit"
                variant="accent"
                size="lg"
                loading={isSubmitting}
                className="w-full mt-5"
              >
                {isFr ? "Creer mon compte" : "Create my account"}
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </form>

            <div className="mt-6 mb-6 text-center text-[11px] text-[var(--text-4)]">
              {isFr ? "Confirmation par email en 2 minutes" : "Email confirmation within 2 minutes"}
            </div>
          </div>
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}
