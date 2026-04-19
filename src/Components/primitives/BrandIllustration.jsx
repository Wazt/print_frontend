import React from "react";

/**
 * BrandIllustration — inline brand imagery for empty states.
 *
 * Variants:
 *   - "production"   → isometric printing press (warm/orange)
 *   - "creative"     → colorful print book (vivid)
 *   - "collaboration"→ team workflow GIF
 *
 * Size presets: sm (120), md (180), lg (260)
 */

const SOURCES = {
  production: "/brand/empty-orders.jpg",
  creative: "/brand/login-hero.jpg",
  collaboration: "/brand/onboarding-hero.gif",
};

const SIZES = {
  sm: "max-w-[120px]",
  md: "max-w-[200px]",
  lg: "max-w-[280px]",
};

function BrandIllustration({
  variant = "production",
  size = "md",
  alt = "",
  className = "",
}) {
  const src = SOURCES[variant];
  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={alt ? undefined : "true"}
      className={`${SIZES[size]} w-full h-auto select-none pointer-events-none ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
}

export default React.memo(BrandIllustration);
