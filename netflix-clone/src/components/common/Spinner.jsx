import React from "react";

const sizeClasses = {
  xs: "h-3 w-3 border-2",
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[3px]",
  xl: "h-12 w-12 border-4",
};

const Spinner = ({
  size = "md",
  color = "white",
  label = "Loading",
  className = "",
}) => {
  const colorClasses = {
    white: "border-white/20 border-t-white",
    red: "border-red-600/20 border-t-red-600",
    black: "border-black/20 border-t-black",
    zinc: "border-zinc-700 border-t-zinc-200",
  };

  return (
    <span
      className={[
        "inline-block animate-spin rounded-full",
        sizeClasses[size] || sizeClasses.md,
        colorClasses[color] || colorClasses.white,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
      aria-label={label}
    />
  );
};

export default Spinner;