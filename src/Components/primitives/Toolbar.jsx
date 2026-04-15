import React from "react";
import { Search } from "lucide-react";

/**
 * Toolbar — search + filters + actions row
 */
export default function Toolbar({ search, onSearchChange, searchPlaceholder = "Rechercher...", filters, actions, className = "" }) {
  return (
    <div className={`flex flex-col md:flex-row md:items-center gap-3 mb-5 ${className}`}>
      {onSearchChange && (
        <div className="relative flex-1 max-w-md">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)] pointer-events-none"
          />
          <input
            type="search"
            value={search ?? ""}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full h-10 pl-9 pr-3 rounded-[var(--radius)] bg-[var(--surface)] border border-[var(--border)] text-[14px] text-[var(--text)] placeholder:text-[var(--text-4)] outline-none transition-colors focus:border-[var(--accent)] focus:shadow-[var(--shadow-focus)]"
          />
        </div>
      )}
      {filters && <div className="flex items-center gap-2 flex-wrap">{filters}</div>}
      {actions && <div className="flex items-center gap-2 md:ml-auto">{actions}</div>}
    </div>
  );
}

/**
 * FilterChip — toggle chip for filters
 */
export function FilterChip({ active, onClick, children, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-[var(--radius)] text-[13px] font-medium border transition-colors ${
        active
          ? "bg-[var(--brand)] text-[var(--brand-fg)] border-[var(--brand)]"
          : "bg-[var(--surface)] text-[var(--text-2)] border-[var(--border)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
      }`}
    >
      {children}
      {count != null && (
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-[var(--radius-pill)] font-semibold ${
            active ? "bg-white/15" : "bg-[var(--surface-2)]"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
