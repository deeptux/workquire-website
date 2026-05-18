import React from "react";

export const Brand = ({ className = "", size = "md", asImage = false }) => {
  const sizes = {
    sm: "text-lg",
    md: "text-xl sm:text-2xl",
    lg: "text-3xl sm:text-4xl",
  };

  if (asImage) {
    const px = size === "lg" ? 80 : size === "sm" ? 28 : 40;
    return (
      <span
        className={`inline-block rounded-full ring-1 ring-white/10 dark:ring-white/10 ${className}`}
        style={{
          width: px,
          height: px,
          backgroundImage: "url(/workquire-logo.png)",
          backgroundSize: "180% 180%",
          backgroundPosition: "50% 28%",
          backgroundRepeat: "no-repeat",
        }}
        aria-label="WorkQuire logo"
        role="img"
      />
    );
  }

  return (
    <span className={`font-display font-bold tracking-tight inline-flex items-center ${sizes[size] || sizes.md} ${className}`}>
      <span>W</span>
      <span
        className="brand-mark"
        aria-hidden="true"
        style={{ backgroundImage: "url(/workquire-logo.png)" }}
      />
      <span>rkQuire</span>
    </span>
  );
};

export default Brand;
