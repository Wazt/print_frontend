import React from "react";

/**
 * SectionTitle — h2 + optional action
 */
export default function SectionTitle({ title, description, action, className = "" }) {
  return (
    <div className={`flex items-end justify-between gap-3 mb-4 ${className}`}>
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-[var(--text)]">{title}</h2>
        {description && <p className="text-xs text-[var(--text-3)] mt-0.5">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-2 flex-shrink-0">{action}</div>}
    </div>
  );
}
