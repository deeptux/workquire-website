import React from "react";

export const Brand = ({ className = "", size = "md" }) => {
  const sizes = {
    sm: "text-lg",
    md: "text-xl sm:text-2xl",
    lg: "text-3xl sm:text-4xl",
  };
  return (
    <span className={`font-display font-bold tracking-tight inline-flex items-center ${sizes[size] || sizes.md} ${className}`}>
      <span>W</span>
      <span className="brand-o" aria-hidden="true" />
      <span>rkQuire</span>
    </span>
  );
};

export default Brand;
