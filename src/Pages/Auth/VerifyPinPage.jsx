import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Printer, Mail, ArrowRight, RotateCw, ArrowLeft, Clock } from "lucide-react";
import { Toaster, toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/Components/LanguageSwitcher";
import { Button, PinInput } from "@/Components/primitives";

const PIN_TTL_SECONDS = 15 * 60; // 15 min
const RESEND_COOLDOWN = 30;

export default function VerifyPinPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { t } = useLanguage();
  const isFr = t("lang") === "fr";

  const email = state?.email || "your@email.com";
  const fullName = state?.fullName;

  const [pin, setPin] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [remainingSec, setRemainingSec] = useState(PIN_TTL_SECONDS);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setRemainingSec((s) => (s > 0 ? s - 1 : 0));
      setResendCooldown((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  const handleComplete = (code) => {
    if (code.length !== 6) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      // Prototype: any 6-digit PIN is accepted
      toast.success(isFr ? "Email verifie" : "Email verified");
      navigate("/auth/set-password", {
        state: { email, fullName, setPasswordToken: "mock-token-abc123" },
      });
    }, 600);
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(RESEND_COOLDOWN);
    setRemainingSec(PIN_TTL_SECONDS);
    setPin("");
    toast.success(
      isFr
        ? `Nouveau code envoye a ${email}`
        : `New code sent to ${email}`
    );
  };

  const expired = remainingSec <= 0;

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
          <div className="w-14 h-14 rounded-[var(--radius-lg)] bg-[var(--accent-bg)] text-[var(--accent)] flex items-center justify-center mb-5">
            <Mail size={24} aria-hidden="true" />
          </div>

          <h1 className="text-[24px] font-semibold text-[var(--text)] tracking-tight">
            {isFr ? "Verifiez votre email" : "Verify your email"}
          </h1>
          <p className="mt-2 text-[14px] text-[var(--text-3)]">
            {isFr ? "Nous avons envoye un code a 6 chiffres a " : "We sent a 6-digit code to "}
            <span className="font-medium text-[var(--text)]">{email}</span>
          </p>

          <div className="mt-7">
            <PinInput
              value={pin}
              onChange={setPin}
              onComplete={handleComplete}
              disabled={isVerifying || expired}
              aria-label={isFr ? "Code de verification" : "Verification code"}
            />
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-[12px]">
            <Clock size={12} className={expired ? "text-[var(--danger)]" : "text-[var(--text-3)]"} aria-hidden="true" />
            <span className={expired ? "text-[var(--danger)] font-medium" : "text-[var(--text-3)]"}>
              {expired
                ? isFr ? "Code expire" : "Code expired"
                : isFr ? `Expire dans ${fmt(remainingSec)}` : `Expires in ${fmt(remainingSec)}`}
            </span>
          </div>

          <Button
            variant="accent"
            size="lg"
            className="w-full mt-5"
            onClick={() => handleComplete(pin)}
            disabled={pin.length !== 6 || isVerifying || expired}
            loading={isVerifying}
          >
            {isFr ? "Verifier et continuer" : "Verify and continue"}
            <ArrowRight size={15} aria-hidden="true" />
          </Button>

          <div className="mt-6 pt-5 border-t border-[var(--border)] space-y-2 text-center text-[13px]">
            <div>
              <span className="text-[var(--text-3)]">
                {isFr ? "Pas recu ? " : "Didn't get it? "}
              </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="font-medium text-[var(--accent)] hover:underline disabled:text-[var(--text-4)] disabled:no-underline disabled:cursor-not-allowed"
              >
                {resendCooldown > 0
                  ? isFr ? `Renvoyer (${resendCooldown}s)` : `Resend (${resendCooldown}s)`
                  : isFr ? "Renvoyer le code" : "Resend code"}
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => navigate("/signup", { replace: true })}
                className="text-[var(--text-3)] hover:text-[var(--text)] inline-flex items-center gap-1"
              >
                <ArrowLeft size={12} aria-hidden="true" />
                {isFr ? "Changer d'email" : "Change email"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-[var(--radius)] bg-[var(--info-bg)] text-[11px] text-[var(--info)] flex items-start gap-2">
          <Mail size={12} className="mt-0.5 flex-shrink-0" />
          <span>
            {isFr
              ? "Demo : n'importe quel code a 6 chiffres est accepte. En production, ce sera un vrai code envoye par email."
              : "Demo: any 6-digit code works. In production this will be a real code sent by email."}
          </span>
        </div>

        {fullName && (
          <div className="mt-5 text-center text-[11px] text-[var(--text-4)]">
            {isFr ? "Bienvenue, " : "Welcome, "}
            {fullName}
          </div>
        )}
      </div>
    </div>
  );
}
