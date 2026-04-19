import React, { useRef, useEffect, useCallback } from "react";

/**
 * PinInput — 6-digit numeric OTP / PIN entry.
 *
 * Props:
 *   value: string (0-6 digits)
 *   onChange: (next: string) => void
 *   onComplete: (pin: string) => void   // called when 6 digits entered
 *   length?: number (default 6)
 *   autoFocus?: bool
 *   disabled?: bool
 */
function PinInput({
  value = "",
  onChange,
  onComplete,
  length = 6,
  autoFocus = true,
  disabled = false,
  "aria-label": ariaLabel,
}) {
  const inputsRef = useRef([]);

  const digits = value.padEnd(length, "").split("").slice(0, length);

  useEffect(() => {
    if (autoFocus && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = useCallback(
    (idx, rawValue) => {
      const sanitized = rawValue.replace(/\D/g, "");
      if (!sanitized) return;

      // Multi-char (paste) support
      if (sanitized.length > 1) {
        const next = (value + sanitized).replace(/\D/g, "").slice(0, length);
        onChange(next);
        if (next.length === length) {
          onComplete?.(next);
          inputsRef.current[length - 1]?.blur();
        } else {
          inputsRef.current[Math.min(next.length, length - 1)]?.focus();
        }
        return;
      }

      // Single char
      const newDigits = [...digits];
      newDigits[idx] = sanitized[0];
      const next = newDigits.join("").replace(/\s/g, "").slice(0, length);
      onChange(next);

      if (idx < length - 1) {
        inputsRef.current[idx + 1]?.focus();
      }

      if (next.length === length && !next.includes("")) {
        onComplete?.(next);
        inputsRef.current[length - 1]?.blur();
      }
    },
    [digits, length, onChange, onComplete, value]
  );

  const handleKeyDown = useCallback(
    (idx, e) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        const newDigits = [...digits];
        if (newDigits[idx]) {
          newDigits[idx] = "";
          onChange(newDigits.join("").trimEnd());
          return;
        }
        if (idx > 0) {
          newDigits[idx - 1] = "";
          onChange(newDigits.slice(0, idx).join(""));
          inputsRef.current[idx - 1]?.focus();
        }
      } else if (e.key === "ArrowLeft" && idx > 0) {
        e.preventDefault();
        inputsRef.current[idx - 1]?.focus();
      } else if (e.key === "ArrowRight" && idx < length - 1) {
        e.preventDefault();
        inputsRef.current[idx + 1]?.focus();
      }
    },
    [digits, length, onChange]
  );

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
      if (!pasted) return;
      onChange(pasted);
      if (pasted.length === length) {
        onComplete?.(pasted);
        inputsRef.current[length - 1]?.blur();
      } else {
        inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
      }
    },
    [length, onChange, onComplete]
  );

  return (
    <div
      className="flex items-center justify-center gap-2 sm:gap-3"
      role="group"
      aria-label={ariaLabel || "Verification code"}
    >
      {Array.from({ length }).map((_, i) => (
        <React.Fragment key={i}>
          <input
            ref={(el) => (inputsRef.current[i] = el)}
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={length}
            value={digits[i] || ""}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            disabled={disabled}
            aria-label={`Digit ${i + 1} of ${length}`}
            className="w-11 h-14 sm:w-12 sm:h-16 text-center text-[24px] sm:text-[28px] font-semibold font-mono tabular-nums rounded-[var(--radius)] bg-[var(--surface)] border-2 border-[var(--border)] text-[var(--text)] outline-none transition-all duration-[var(--dur-fast)] focus:border-[var(--accent)] focus:shadow-[var(--shadow-focus)] disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {i === Math.floor(length / 2) - 1 && (
            <span
              className="text-[var(--text-4)] text-[18px] font-light select-none"
              aria-hidden="true"
            >
              —
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default React.memo(PinInput);
