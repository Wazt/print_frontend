import React from "react";

/**
 * EmptyState — icon + title + description + optional CTA
 */
export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      {Icon && (
        <div className="w-14 h-14 rounded-[var(--radius-lg)] bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-3)] mb-4">
          <Icon size={24} />
        </div>
      )}
      <h3 className="text-[15px] font-semibold text-[var(--text)] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--text-3)] max-w-sm mb-5">{description}</p>
      )}
      {action}
    </div>
  );
}
