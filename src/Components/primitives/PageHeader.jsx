import React from "react";

/**
 * PageHeader — title + subtitle + actions
 * Used at the top of every page for consistent header styling.
 */
export default function PageHeader({ title, subtitle, breadcrumb, actions, icon: Icon }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
      <div className="min-w-0">
        {breadcrumb && (
          <div className="text-xs text-[var(--text-3)] mb-1.5 font-mono">{breadcrumb}</div>
        )}
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)] flex-shrink-0">
              <Icon size={20} />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-[var(--text)] tracking-tight truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-[var(--text-3)] mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}
