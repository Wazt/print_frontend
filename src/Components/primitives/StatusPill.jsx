import React from "react";

const TONE_MAP = {
  success: { bg: "var(--success-bg)", color: "var(--success)" },
  warning: { bg: "var(--warning-bg)", color: "var(--warning)" },
  danger:  { bg: "var(--danger-bg)", color: "var(--danger)" },
  info:    { bg: "var(--info-bg)", color: "var(--info)" },
  accent:  { bg: "var(--accent-bg)", color: "var(--accent)" },
  neutral: { bg: "var(--neutral-bg)", color: "var(--text-2)" },
};

const STATUS_TONE = {
  PENDING: "warning",
  ACCEPTED: "info",
  PROCESSING: "info",
  PROCESSED: "info",
  PARTIAL_DELIVERED: "info",
  DELIVERED: "success",
  PARTIAL_PAID: "info",
  PAID: "success",
  FINISHED: "success",
  CANCELLED: "neutral",
  REJECTED: "danger",
  ACTIVE: "success",
  INACTIVE: "neutral",
  pending: "warning",
  accepted: "info",
  processing: "info",
  delivered: "success",
  paid: "success",
  finished: "success",
  cancelled: "neutral",
  rejected: "danger",
};

/**
 * StatusPill — semantic status badge
 * Pass `tone` directly OR `status` for auto-mapping.
 */
function StatusPill({ status, tone, label, dot = true, size = "md", className = "" }) {
  const resolvedTone = tone || STATUS_TONE[status] || "neutral";
  const t = TONE_MAP[resolvedTone] || TONE_MAP.neutral;
  const text = label || (typeof status === "string" ? status.replace(/_/g, " ").toLowerCase() : "");

  const sizes = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-[11px] px-2.5 py-1",
    lg: "text-xs px-3 py-1.5",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] font-medium capitalize whitespace-nowrap ${sizes[size]} ${className}`}
      style={{ background: t.bg, color: t.color }}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />}
      {text}
    </span>
  );
}

export default React.memo(StatusPill);
