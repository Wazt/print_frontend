import { useContext, useState } from "react";
import { Printer, Loader2, Eye, EyeOff, Lock, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { Toaster } from "sonner";
import AuthContext from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/Components/LanguageSwitcher";
import { Button, FormField, Input } from "@/Components/primitives";

export default function LoginPage() {
  const { login, isLoading } = useContext(AuthContext);
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      {/* Left — branding (always dark) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] text-white flex-col p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-sky-500/5 blur-3xl" />

        <div className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[var(--radius)] bg-sky-500 flex items-center justify-center">
            <Printer size={18} className="text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">PrintFlow</span>
        </div>

        <div className="relative mt-auto max-w-md">
          <h1 className="text-4xl font-semibold tracking-tight leading-tight mb-4">
            {t("lang") === "fr"
              ? "Gerez vos commandes d'impression avec precision."
              : "Manage print orders with precision."}
          </h1>
          <p className="text-[15px] text-white/60 leading-relaxed mb-8">
            {t("lang") === "fr"
              ? "Suivi temps reel, validation BAT, gestion des stocks et facturation — tout dans une plateforme unifiee."
              : "Real-time tracking, proof approval, inventory management and invoicing — all in one unified platform."}
          </p>

          <div className="space-y-3">
            {[
              t("lang") === "fr" ? "Suivi de production en temps reel" : "Real-time production tracking",
              t("lang") === "fr" ? "Gestion clients & commandes centralisee" : "Centralized client & order management",
              t("lang") === "fr" ? "Facturation & paiements integres" : "Built-in invoicing & payments",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2.5 text-[14px] text-white/80">
                <CheckCircle2 size={16} className="text-sky-400 flex-shrink-0" />
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
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-6">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-[var(--radius)] bg-[var(--brand)] flex items-center justify-center">
              <Printer size={16} className="text-[var(--brand-fg)]" />
            </div>
            <span className="font-semibold text-[var(--text)]">PrintFlow</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher />
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-[var(--text)] tracking-tight">
                {t("lang") === "fr" ? "Bienvenue" : "Welcome back"}
              </h2>
              <p className="mt-2 text-[14px] text-[var(--text-3)]">
                {t("lang") === "fr"
                  ? "Connectez-vous pour acceder a votre tableau de bord"
                  : "Sign in to access your dashboard"}
              </p>
            </div>

            <form onSubmit={login} className="space-y-5">
              <FormField
                label={t("lang") === "fr" ? "Adresse email" : "Email address"}
                htmlFor="email"
              >
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)]" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    className="pl-9 w-full"
                  />
                </div>
              </FormField>

              <FormField
                label={t("lang") === "fr" ? "Mot de passe" : "Password"}
                htmlFor="password"
              >
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)]" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="pl-9 pr-10 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-4)] hover:text-[var(--text-2)]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </FormField>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-[13px] text-[var(--text-2)] cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-[var(--border-2)] accent-[var(--accent)]" />
                  {t("lang") === "fr" ? "Rester connecte" : "Keep me signed in"}
                </label>
                <button
                  type="button"
                  className="text-[13px] font-medium text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] rounded-[var(--radius-sm)]"
                  onClick={() => {
                    // TODO: wire up forgot password flow
                  }}
                >
                  {t("lang") === "fr" ? "Mot de passe oublie ?" : "Forgot password?"}
                </button>
              </div>

              <Button type="submit" variant="accent" size="lg" loading={isLoading} className="w-full">
                {isLoading
                  ? (t("lang") === "fr" ? "Connexion..." : "Signing in...")
                  : (
                    <>
                      {t("lang") === "fr" ? "Se connecter" : "Sign in"}
                      <ArrowRight size={16} />
                    </>
                  )}
              </Button>
            </form>

            <div className="mt-8 flex items-center justify-center gap-2 text-[12px] text-[var(--text-4)]">
              <Lock size={12} />
              {t("lang") === "fr" ? "Vos donnees sont securisees" : "Your data is secure and encrypted"}
            </div>
          </div>
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}
