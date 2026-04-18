import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Printer, Lock, Eye, EyeOff, CheckCircle2, ArrowRight, AlertCircle } from "lucide-react";
import { Toaster, toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/Components/LanguageSwitcher";
import { Button, FormField, Input } from "@/Components/primitives";

function strengthOf(pw) {
  if (!pw) return { score: 0, label: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  return {
    score,
    label:
      score <= 1 ? "weak" : score <= 3 ? "ok" : "strong",
  };
}

export default function SetPasswordPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { t } = useLanguage();
  const isFr = t("lang") === "fr";

  const email = state?.email || "";
  const fullName = state?.fullName;
  const isFirstTime = !state?.fromReset; // false on /auth/set-password after signup, true when coming from reset

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const strength = strengthOf(pw);
  const strengthColor = {
    weak: "var(--danger)",
    ok: "var(--warning)",
    strong: "var(--success)",
  }[strength.label];
  const strengthLabelFr = {
    weak: "Faible",
    ok: "Correct",
    strong: "Fort",
  }[strength.label];
  const strengthLabel = isFr ? strengthLabelFr : strength.label;

  const mismatch = pw && pw2 && pw !== pw2;
  const valid = pw.length >= 8 && pw === pw2;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!valid) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        isFr
          ? "Mot de passe defini. Bienvenue sur PrintFlow !"
          : "Password set. Welcome to PrintFlow!"
      );
      navigate("/auth/login", {
        state: { signupSuccess: true, email },
        replace: true,
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-6">
      <Toaster position="top-right" />

      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-[var(--radius)] bg-[var(--brand)] flex items-center justify-center">
            <Printer size={18} className="text-[var(--brand-fg)]" aria-hidden="true" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-[var(--text)]">
            PrintFlow
          </span>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-card)]">
          <div className="w-14 h-14 rounded-[var(--radius-lg)] bg-[var(--success-bg)] text-[var(--success)] flex items-center justify-center mb-5">
            <CheckCircle2 size={26} aria-hidden="true" />
          </div>

          <h1 className="text-[24px] font-semibold text-[var(--text)] tracking-tight">
            {isFirstTime
              ? isFr ? "Creez votre mot de passe" : "Create your password"
              : isFr ? "Nouveau mot de passe" : "New password"}
          </h1>
          <p className="mt-2 text-[14px] text-[var(--text-3)]">
            {isFirstTime
              ? isFr ? "Dernier ecran avant l'acces a votre compte." : "Last screen before your account is ready."
              : isFr ? "Choisissez un nouveau mot de passe pour securiser votre compte." : "Choose a new password to secure your account."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <FormField
              label={isFr ? "Mot de passe" : "Password"}
              htmlFor="password"
              required
              hint={
                isFr
                  ? "Minimum 8 caracteres. Melange de majuscules, chiffres et symboles recommande."
                  : "Minimum 8 characters. Mix of uppercase, numbers, and symbols recommended."
              }
            >
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)]" aria-hidden="true" />
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="pl-9 pr-10 w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-4)] hover:text-[var(--text-2)]"
                  aria-label={showPw ? (isFr ? "Masquer" : "Hide password") : (isFr ? "Afficher" : "Show password")}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </FormField>

            {pw.length > 0 && (
              <div className="flex items-center gap-2 -mt-2">
                <div className="flex-1 h-1 rounded-full bg-[var(--surface-2)] overflow-hidden">
                  <div
                    className="h-full transition-all duration-[var(--dur)]"
                    style={{
                      width: `${(strength.score / 5) * 100}%`,
                      background: strengthColor,
                    }}
                  />
                </div>
                <span
                  className="text-[11px] font-semibold capitalize"
                  style={{ color: strengthColor }}
                >
                  {strengthLabel}
                </span>
              </div>
            )}

            <FormField
              label={isFr ? "Confirmer le mot de passe" : "Confirm password"}
              htmlFor="password2"
              required
              error={mismatch ? (isFr ? "Les mots de passe ne correspondent pas" : "Passwords don't match") : null}
            >
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)]" aria-hidden="true" />
                <Input
                  id="password2"
                  type={showPw ? "text" : "password"}
                  value={pw2}
                  onChange={(e) => setPw2(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="pl-9 w-full"
                  style={mismatch ? { borderColor: "var(--danger)" } : undefined}
                />
              </div>
            </FormField>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full"
              disabled={!valid || isSubmitting}
              loading={isSubmitting}
            >
              {isFirstTime
                ? isFr ? "Finaliser mon compte" : "Finish setup"
                : isFr ? "Enregistrer" : "Save password"}
              <ArrowRight size={15} aria-hidden="true" />
            </Button>
          </form>

          {email && (
            <div className="mt-5 pt-5 border-t border-[var(--border)] text-center text-[12px] text-[var(--text-3)]">
              {isFr ? "Pour " : "For "}
              <span className="font-medium text-[var(--text-2)]">{email}</span>
            </div>
          )}
        </div>

        <div className="mt-4 p-3 rounded-[var(--radius)] bg-[var(--info-bg)] text-[11px] text-[var(--info)] flex items-start gap-2">
          <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
          <span>
            {isFr
              ? "Demo : aucun compte reel n'est cree. Vous serez redirige vers /auth/login avec une confirmation."
              : "Demo: no real account is created. You'll be redirected to /auth/login with a confirmation."}
          </span>
        </div>
      </div>
    </div>
  );
}
