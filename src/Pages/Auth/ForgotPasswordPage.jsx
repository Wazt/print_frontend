import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Printer, Mail, ArrowLeft, ArrowRight, KeyRound } from "lucide-react";
import { Toaster, toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/Components/LanguageSwitcher";
import { Button, FormField, Input } from "@/Components/primitives";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isFr = t("lang") === "fr";

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(isFr ? "Code envoye" : "Code sent");
      navigate("/auth/reset-password", { state: { email } });
    }, 500);
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
          <div className="w-14 h-14 rounded-[var(--radius-lg)] bg-[var(--warning-bg)] text-[var(--warning)] flex items-center justify-center mb-5">
            <KeyRound size={24} aria-hidden="true" />
          </div>

          <h1 className="text-[24px] font-semibold text-[var(--text)] tracking-tight">
            {isFr ? "Mot de passe oublie ?" : "Forgot your password?"}
          </h1>
          <p className="mt-2 text-[14px] text-[var(--text-3)]">
            {isFr
              ? "Entrez votre email, nous vous envoyons un code a 6 chiffres pour le reinitialiser."
              : "Enter your email and we'll send you a 6-digit code to reset it."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <FormField label="Email" htmlFor="email" required>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)]" aria-hidden="true" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="pl-9 w-full"
                />
              </div>
            </FormField>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full"
              loading={isSubmitting}
            >
              {isFr ? "Envoyer le code" : "Send code"}
              <ArrowRight size={15} aria-hidden="true" />
            </Button>
          </form>

          <div className="mt-5 pt-5 border-t border-[var(--border)] text-center">
            <button
              type="button"
              onClick={() => navigate("/auth/login")}
              className="text-[13px] text-[var(--text-3)] hover:text-[var(--text)] inline-flex items-center gap-1"
            >
              <ArrowLeft size={12} aria-hidden="true" />
              {isFr ? "Retour a la connexion" : "Back to login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
