import React from "react";
import {
  CheckCircle, Circle, Clock, Package, Truck, CreditCard, XCircle, CheckCheck,
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
  const currentStageIndex = stages.findIndex((stage) => stage.key === statusUpper);

  const getStageStatus = (index) => {
    if (isRejected || isCancelled) return "cancelled";
    if (index < currentStageIndex) return "completed";
    if (index === currentStageIndex) return "current";
    return "upcoming";
  };

  const stageStyles = {
    completed: {
      background: "var(--success)",
      borderColor: "var(--success)",
      color: "#fff",
    },
    current: {
      background: "var(--accent)",
      borderColor: "var(--accent)",
      color: "#fff",
    },
    cancelled: {
      background: "var(--danger)",
      borderColor: "var(--danger)",
      color: "#fff",
    },
    upcoming: {
      background: "var(--surface-2)",
      borderColor: "var(--border-2)",
      color: "var(--text-4)",
    },
  };

  const progress =
    isRejected || isCancelled
      ? 0
      : currentStageIndex > 0
      ? (currentStageIndex / (stages.length - 1)) * 100
      : 0;

  const title = isFr ? "Progression de la commande" : "Order progress";
  const subtitle = isRejected
    ? isFr
      ? "Cette commande a ete rejetee"
      : "This order has been rejected"
    : isCancelled
    ? isFr
      ? "Cette commande a ete annulee"
      : "This order has been cancelled"
    : isFr
    ? "Suivez votre commande etape par etape"
    : "Track your order through each stage";

  return (
    <DataCard title={title} description={subtitle}>
      <div className="relative pt-2">
        {/* Base progress line */}
        <div
          className="absolute top-7 left-0 right-0 h-0.5 hidden sm:block"
          style={{ background: "var(--border)" }}
        />
        {/* Progress fill */}
        <div
          className="absolute top-7 left-0 h-0.5 transition-all duration-[var(--dur-slow)] hidden sm:block"
          style={{
            width: `${progress}%`,
            background: isRejected || isCancelled ? "var(--danger)" : "var(--success)",
          }}
        />

        <div className="relative grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-y-5 gap-x-2">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const stageStatus = getStageStatus(index);
            const style = stageStyles[stageStatus];
            const isActive = stageStatus === "current";

            return (
              <div key={stage.key} className="flex flex-col items-center text-center">
                <div
                  className={`relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-[var(--dur)] ${
                    isActive ? "animate-pulse" : ""
                  }`}
                  style={style}
                >
                  {stageStatus === "completed" ? (
                    <CheckCircle size={18} strokeWidth={2.5} />
                  ) : stageStatus === "cancelled" ? (
                    <XCircle size={18} strokeWidth={2.5} />
                  ) : stageStatus === "current" ? (
                    <Icon size={18} strokeWidth={2.5} />
                  ) : (
                    <Circle size={18} strokeWidth={2} />
                  )}
                </div>
                <div className="mt-2 min-h-[32px]">
                  <p
                    className="text-[11px] font-medium leading-tight"
                    style={{
                      color: isActive ? "var(--text)" : "var(--text-3)",
                    }}
                  >
                    {stage.label}
                  </p>
                  {isActive && !isRejected && !isCancelled && (
                    <span
                      className="inline-block mt-1 px-2 py-0.5 rounded-[var(--radius-pill)] text-[10px] font-semibold"
                      style={{
                        background: "var(--accent-bg)",
                        color: "var(--accent)",
                      }}
                    >
                      {isFr ? "En cours" : "Current"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {(isRejected || isCancelled) && (
        <div
          className="mt-6 p-4 rounded-[var(--radius-lg)] flex items-center gap-3"
          style={{
            background: "var(--danger-bg)",
            border: "1px solid color-mix(in srgb, var(--danger) 20%, transparent)",
          }}
        >
          <div
            className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--danger)" }}
          >
            <XCircle className="text-white" size={20} />
          </div>
          <div>
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
