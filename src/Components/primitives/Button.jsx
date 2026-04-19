import React from "react";

const VARIANT_STYLES = {
  primary: "bg-[var(--brand)] text-[var(--brand-fg)] hover:bg-[var(--brand-2)] border-transparent",
  accent:  "bg-[var(--accent)] text-[var(--accent-fg)] hover:bg-[var(--accent-2)] border-transparent",
  outline: "bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-2)] border-[var(--border)] hover:border-[var(--border-2)]",
  ghost:   "bg-transparent text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] border-transparent",
  danger:  "bg-[var(--danger)] text-white hover:opacity-90 border-transparent",
};

const SIZE_STYLES = {
  sm: "h-8 px-3 text-[13px] gap-1.5",
  md: "h-10 px-4 text-[14px] gap-2",
  lg: "h-11 px-5 text-[15px] gap-2",
  icon: "h-9 w-9",
};

/**
 * Button — unified button primitive
 */
function Button({
  variant = "outline",
  size = "md",
  type = "button",
  disabled,
  loading,
  className = "",
  children,
  asChild,
  ...props
}) {
  const cls = `inline-flex items-center justify-center font-medium rounded-[var(--radius)] border transition-all duration-[var(--dur-fast)] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { className: `${cls} ${children.props.className || ""}` });
  }

  return (
    <button type={type} disabled={disabled || loading} className={cls} {...props}>
      {loading && <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}

export default React.memo(Button);
