import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Printer, KeyRound, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { Toaster, toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/Components/LanguageSwitcher";
import { Button, PinInput } from "@/Components/primitives";

const PIN_TTL_SECONDS = 15 * 60;
const RESEND_COOLDOWN = 30;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { t } = useLanguage();
  const isFr = t("lang") === "fr";

  const email = state?.email || "";
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
      navigate("/auth/set-password", {
        state: { email, setPasswordToken: "mock-reset-token", fromReset: true },
      });
    }, 600);
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(RESEND_COOLDOWN);
    setRemainingSec(PIN_TTL_SECONDS);
    setPin("");
    toast.success(isFr ? "Nouveau code envoye" : "New code sent");
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
            <KeyRound size={24} aria-hidden="true" />
          </div>

          <h1 className="text-[24px] font-semibold text-[var(--text)] tracking-tight">
            {isFr ? "Verifiez le code" : "Enter the code"}
          </h1>
          <p className="mt-2 text-[14px] text-[var(--text-3)]">
            {isFr ? "Code envoye a " : "Code sent to "}
            <span className="font-medium text-[var(--text)]">{email || "your email"}</span>
          </p>

          <div className="mt-7">
            <PinInput
              value={pin}
              onChange={setPin}
              onComplete={handleComplete}
              disabled={isVerifying || expired}
              aria-label={isFr ? "Code de reinitialisation" : "Reset code"}
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
            {isFr ? "Continuer" : "Continue"}
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
                  : isFr ? "Renvoyer" : "Resend"}
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => navigate("/auth/login")}
                className="text-[var(--text-3)] hover:text-[var(--text)] inline-flex items-center gap-1"
              >
                <ArrowLeft size={12} aria-hidden="true" />
                {isFr ? "Retour a la connexion" : "Back to login"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
