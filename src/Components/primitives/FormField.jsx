import React from "react";

/**
 * FormField — label + input wrapper + error
 */
export default function FormField({ label, htmlFor, error, hint, required, className = "", children }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-[13px] font-medium text-[var(--text-2)] flex items-center gap-1"
        >
          {label}
          {required && <span className="text-[var(--danger)]">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-[var(--danger)] mt-0.5">{error}</p>
      ) : hint ? (
        <p className="text-xs text-[var(--text-3)] mt-0.5">{hint}</p>
      ) : null}
    </div>
  );
}

/**
 * Input — base text input
 */
export function Input({ className = "", ...props }) {
  return (
    <input
      className={`h-10 px-3 rounded-[var(--radius)] bg-[var(--surface)] border border-[var(--border)] text-[14px] text-[var(--text)] placeholder:text-[var(--text-4)] outline-none transition-colors focus:border-[var(--accent)] focus:shadow-[var(--shadow-focus)] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
}

/**
 * Textarea — multiline input
 */
export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`min-h-[80px] px-3 py-2.5 rounded-[var(--radius)] bg-[var(--surface)] border border-[var(--border)] text-[14px] text-[var(--text)] placeholder:text-[var(--text-4)] outline-none transition-colors focus:border-[var(--accent)] focus:shadow-[var(--shadow-focus)] disabled:opacity-50 resize-y ${className}`}
      {...props}
    />
  );
}

/**
 * Select — native select wrapper
 */
export function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`h-10 px-3 rounded-[var(--radius)] bg-[var(--surface)] border border-[var(--border)] text-[14px] text-[var(--text)] outline-none transition-colors focus:border-[var(--accent)] focus:shadow-[var(--shadow-focus)] disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
