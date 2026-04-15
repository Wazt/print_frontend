import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const TONE_STYLES = {
  default: { iconBg: "var(--surface-2)", iconColor: "var(--text-2)" },
  accent:  { iconBg: "var(--accent-bg)", iconColor: "var(--accent)" },
  success: { iconBg: "var(--success-bg)", iconColor: "var(--success)" },
  warning: { iconBg: "var(--warning-bg)", iconColor: "var(--warning)" },
  danger:  { iconBg: "var(--danger-bg)", iconColor: "var(--danger)" },
};

/**
 * StatCard — KPI card with label, value, trend, icon
 */
export default function StatCard({
  label,
  value,
  hint,
  delta,
  deltaPositive,
  icon: Icon,
  tone = "default",
  loading = false,
}) {
  const t = TONE_STYLES[tone] || TONE_STYLES.default;

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5 transition-all duration-[var(--dur)] hover:shadow-[var(--shadow-lift)] hover:-translate-y-px">
      <div className="flex items-start justify-between mb-3">
        <div className="text-xs uppercase tracking-wider text-[var(--text-3)] font-medium">
          {label}
        </div>
        {Icon && (
          <div
            className="w-9 h-9 rounded-[var(--radius)] flex items-center justify-center flex-shrink-0"
            style={{ background: t.iconBg, color: t.iconColor }}
          >
            <Icon size={16} />
          </div>
        )}
      </div>
      {loading ? (
        <div className="h-8 w-20 bg-[var(--surface-2)] rounded animate-pulse" />
      ) : (
        <div className="text-3xl font-semibold text-[var(--text)] tracking-tight leading-none">
          {value ?? "—"}
        </div>
      )}
      {(hint || delta) && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          {delta != null && (
            <span
              className={`inline-flex items-center gap-1 font-medium ${
                deltaPositive ? "text-[var(--success)]" : "text-[var(--danger)]"
              }`}
            >
              {deltaPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {delta}
            </span>
          )}
          {hint && <span className="text-[var(--text-3)]">{hint}</span>}
        </div>
      )}
    </div>
  );
}
