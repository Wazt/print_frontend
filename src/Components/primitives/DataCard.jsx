import React from "react";

/**
 * DataCard — generic card with optional header + body
 */
export default function DataCard({ title, description, icon: Icon, action, padded = true, className = "", children }) {
  const hasHeader = title || description || action;
  return (
    <div className={`bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden ${className}`}>
      {hasHeader && (
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {Icon && (
              <div className="w-8 h-8 rounded-[var(--radius)] bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-2)] flex-shrink-0">
                <Icon size={15} />
              </div>
            )}
            <div className="min-w-0">
              {title && <h3 className="text-[15px] font-semibold text-[var(--text)] truncate">{title}</h3>}
              {description && <p className="text-xs text-[var(--text-3)] mt-0.5">{description}</p>}
            </div>
          </div>
          {action && <div className="flex items-center gap-2 flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className={padded ? "p-5" : ""}>{children}</div>
    </div>
  );
}
