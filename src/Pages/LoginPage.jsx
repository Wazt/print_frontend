import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Printer, Eye, EyeOff, Lock, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { Toaster, toast } from "sonner";
import AuthContext from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/Components/LanguageSwitcher";
import { Button, FormField, Input } from "@/Components/primitives";

export default function LoginPage() {
  const { login, isLoading } = useContext(AuthContext);
  const { t } = useLanguage();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const isFr = t("lang") === "fr";

  // Banner when redirected from signup / password reset
  useEffect(() => {
    if (state?.signupSuccess) {
      toast.success(
        isFr
          ? "Compte cree ! Connectez-vous avec votre nouveau mot de passe."
          : "Account created! Sign in with your new password."
      );
    }
  }, [state, isFr]);

  const handleOAuth = (provider) => {
    toast.info(
      isFr
        ? `OAuth ${provider} — disponible en phase A (backend requis)`
        : `${provider} OAuth — coming in phase A (backend required)`
    );
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      {/* Left — branding (video hero with dark overlay) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] text-white flex-col p-10 relative overflow-hidden">
        {/* Video hero — autoplays muted, poster = paint splash for instant paint-in */}
        <video
          src="/brand/login-hero.mp4"
          poster="/brand/login-hero.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark gradient overlay — keep text readable */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/95 via-[#0F172A]/80 to-[#0F172A]/60" />
        <div className="absolute inset-0 bg-[#0F172A]/40" />

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
                {isFr ? "Bienvenue" : "Welcome back"}
              </h2>
              <p className="mt-2 text-[14px] text-[var(--text-3)]">
                {isFr ? "Pas encore de compte ? " : "No account yet? "}
                <Link to="/signup" className="font-medium text-[var(--accent)] hover:underline">
                  {isFr ? "Inscrivez-vous" : "Sign up"}
                </Link>
              </p>
            </div>

            {/* OAuth buttons */}
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
                  {isFr ? "ou avec email" : "or with email"}
                </span>
              </div>
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
                  {isFr ? "Rester connecte" : "Keep me signed in"}
                </label>
                <button
                  type="button"
                  className="text-[13px] font-medium text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] rounded-[var(--radius-sm)]"
                  onClick={() => navigate("/auth/forgot-password")}
                >
                  {isFr ? "Mot de passe oublie ?" : "Forgot password?"}
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
