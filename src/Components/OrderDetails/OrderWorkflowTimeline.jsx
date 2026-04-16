import React from "react";
import {
  Clock, CheckCircle, Package, Truck, CreditCard, CheckCheck, XCircle,
} from "lucide-react";
import { DataCard } from "@/Components/primitives";
import { useLanguage } from "@/contexts/LanguageContext";

const STAGES_EN = [
  { key: "PENDING", label: "Pending", icon: Clock },
  { key: "ACCEPTED", label: "Accepted", icon: CheckCircle },
  { key: "PROCESSING", label: "Processing", icon: Package },
  { key: "PROCESSED", label: "Processed", icon: Package },
  { key: "PARTIAL_DELIVERED", label: "Partial delivered", icon: Truck },
  { key: "DELIVRED", label: "Delivered", icon: Truck },
  { key: "PARTIAL_PAIED", label: "Partial paid", icon: CreditCard },
  { key: "PAIED", label: "Paid", icon: CreditCard },
  { key: "FINISHED", label: "Finished", icon: CheckCheck },
];

const STAGES_FR = [
  { key: "PENDING", label: "En attente", icon: Clock },
  { key: "ACCEPTED", label: "Acceptee", icon: CheckCircle },
  { key: "PROCESSING", label: "En cours", icon: Package },
  { key: "PROCESSED", label: "Traitee", icon: Package },
  { key: "PARTIAL_DELIVERED", label: "Livr. partielle", icon: Truck },
  { key: "DELIVRED", label: "Livree", icon: Truck },
  { key: "PARTIAL_PAIED", label: "Paie partiel", icon: CreditCard },
  { key: "PAIED", label: "Payee", icon: CreditCard },
  { key: "FINISHED", label: "Terminee", icon: CheckCheck },
];

function OrderWorkflowTimeline({ status }) {
  const { t } = useLanguage();
  const isFr = t("lang") === "fr";
  const stages = isFr ? STAGES_FR : STAGES_EN;

  const statusUpper = status?.toUpperCase();
  const isRejected = statusUpper === "REJECTED";
  const isCancelled = statusUpper === "CANCELLED";
  const isFailed = isRejected || isCancelled;

  const currentStageIndex = stages.findIndex((s) => s.key === statusUpper);
  const effectiveIndex = currentStageIndex >= 0 ? currentStageIndex : 0;
  const completedCount = isFailed ? 0 : effectiveIndex;
  const totalSteps = stages.length;
  const percentage = isFailed
    ? 0
    : Math.round(((effectiveIndex + 1) / totalSteps) * 100);

  const currentStage = stages[effectiveIndex];

  const title = isFr ? "Progression de la commande" : "Order progress";
  const subtitle = isFailed
    ? isRejected
      ? isFr ? "Cette commande a ete rejetee" : "This order has been rejected"
      : isFr ? "Cette commande a ete annulee" : "This order has been cancelled"
    : isFr ? "Suivez votre commande etape par etape" : "Track your order step by step";

  return (
    <DataCard title={title} description={subtitle}>
      {/* Top row: step count + current step label */}
      <div className="flex items-end justify-between mb-4 gap-4">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-[var(--text-3)] font-medium">
            {isFr ? "Etape" : "Step"}
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-[24px] font-bold text-[var(--text)] tabular-nums leading-none">
              {isFailed ? "—" : effectiveIndex + 1}
            </span>
            <span className="text-[13px] text-[var(--text-3)] tabular-nums">
              / {totalSteps}
            </span>
            {!isFailed && (
              <span className="text-[11px] text-[var(--text-3)] ml-2">
                · {percentage}%
              </span>
            )}
          </div>
        </div>

        {!isFailed && currentStage && (
          <div className="text-right min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-[var(--text-3)] font-medium">
              {isFr ? "En cours" : "Current"}
            </div>
            <div className="flex items-center gap-1.5 mt-1 justify-end">
              <currentStage.icon size={14} className="text-[var(--accent)]" aria-hidden="true" />
              <span className="text-[13px] font-semibold text-[var(--text)] truncate">
                {currentStage.label}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Icons row — float above the bar */}
      <div className="hidden sm:flex items-center justify-between mb-2 px-0.5">
        {stages.map((stage, i) => {
          const Icon = stage.icon;
          const isDone = !isFailed && i < effectiveIndex;
          const isActive = !isFailed && i === effectiveIndex;
          const color = isFailed
            ? "var(--danger)"
            : isDone
            ? "var(--accent)"
            : isActive
            ? "var(--accent)"
            : "var(--text-4)";
          return (
            <div
              key={stage.key}
              className="flex-1 flex justify-center"
              style={{ opacity: isActive || isDone ? 1 : 0.5 }}
            >
              <Icon size={13} style={{ color }} aria-hidden="true" />
            </div>
          );
        })}
      </div>

      {/* The segmented bar */}
      <div
        className="flex w-full h-3 sm:h-3.5 rounded-[var(--radius-pill)] overflow-hidden"
        style={{ background: "var(--surface-2)", gap: "2px" }}
        role="progressbar"
        aria-valuenow={isFailed ? 0 : percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${title} ${effectiveIndex + 1}/${totalSteps}`}
      >
        {stages.map((stage, i) => {
          const isDone = !isFailed && i < effectiveIndex;
          const isActive = !isFailed && i === effectiveIndex;
          const isUpcoming = !isFailed && i > effectiveIndex;

          const background = isFailed
            ? "var(--danger)"
            : isDone
            ? "var(--accent)"
            : isActive
            ? "var(--accent)"
            : "var(--surface-2)";

          return (
            <div
              key={stage.key}
              className="relative flex-1 transition-all duration-[var(--dur-slow)] ease-out"
              style={{
                background,
                boxShadow: isActive
                  ? "0 0 12px -2px color-mix(in srgb, var(--accent) 55%, transparent)"
                  : "none",
                opacity: isUpcoming ? 1 : 1,
              }}
              title={stage.label}
            >
              {/* Shimmer overlay — only on the active segment */}
              {isActive && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ mixBlendMode: "overlay" }}
                >
                  <div
                    className="absolute inset-y-0 w-1/2"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
                      animation: "shimmer-slide 1.8s linear infinite",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Stage labels row — only prev/current/next shown on mobile, all on desktop */}
      <div className="hidden md:flex items-start justify-between mt-2 px-0.5 gap-1">
        {stages.map((stage, i) => {
          const isDone = !isFailed && i < effectiveIndex;
          const isActive = !isFailed && i === effectiveIndex;
          return (
            <div
              key={stage.key}
              className="flex-1 text-center text-[10px] font-medium leading-tight truncate"
              style={{
                color: isActive
                  ? "var(--text)"
                  : isDone
                  ? "var(--text-2)"
                  : "var(--text-4)",
              }}
            >
              {stage.label}
            </div>
          );
        })}
      </div>

      {/* Mobile compact labels: prev · current · next */}
      <div className="flex md:hidden items-center justify-between mt-3 text-[11px]">
        {effectiveIndex > 0 && !isFailed ? (
          <div className="text-[var(--text-3)] truncate max-w-[30%]">
            ← {stages[effectiveIndex - 1].label}
          </div>
        ) : (
          <div />
        )}
        <div className="font-semibold text-[var(--text)] truncate max-w-[40%] text-center">
          {currentStage?.label}
        </div>
        {!isFailed && effectiveIndex < stages.length - 1 ? (
          <div className="text-[var(--text-3)] truncate max-w-[30%] text-right">
            {stages[effectiveIndex + 1].label} →
          </div>
        ) : (
          <div />
        )}
      </div>

      {/* Rejected / Cancelled banner */}
      {isFailed && (
        <div
          className="mt-5 p-4 rounded-[var(--radius-lg)] flex items-center gap-3"
          style={{
            background: "var(--danger-bg)",
            border: "1px solid color-mix(in srgb, var(--danger) 20%, transparent)",
          }}
        >
          <div
            className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--danger)" }}
          >
            <XCircle className="text-white" size={20} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[14px]" style={{ color: "var(--danger)" }}>
              {isRejected
                ? isFr ? "Commande rejetee" : "Order rejected"
                : isFr ? "Commande annulee" : "Order cancelled"}
            </p>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--danger)", opacity: 0.8 }}>
              {isFr
                ? "Cette commande ne sera pas traitee"
                : "This order will not be processed further"}
            </p>
          </div>
        </div>
      )}
    </DataCard>
  );
}

export default React.memo(OrderWorkflowTimeline);
