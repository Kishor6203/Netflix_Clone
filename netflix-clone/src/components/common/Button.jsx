import React, { forwardRef } from "react";
import { Link } from "react-router-dom";

const variants = {
  primary:
    "bg-white text-black hover:bg-zinc-200 focus-visible:ring-white",

  netflix:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",

  secondary:
    "bg-zinc-700/90 text-white hover:bg-zinc-600 focus-visible:ring-zinc-400",

  ghost:
    "bg-transparent text-white hover:bg-white/10 focus-visible:ring-white",

  outline:
    "border border-white/30 bg-transparent text-white hover:bg-white/10 focus-visible:ring-white",

  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",

  success:
    "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500",
};

const sizes = {
  xs: "min-h-8 px-3 text-xs",
  sm: "min-h-9 px-4 text-sm",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-6 text-base",
  xl: "min-h-14 px-8 text-lg",
};

const Spinner = ({ size = "sm" }) => {
  const sizes = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
  };

  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${
        sizes[size] || sizes.sm
      }`}
      aria-hidden="true"
    />
  );
};

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      iconOnly = false,
      as = "button",
      to,
      href,
      type = "button",
      className = "",
      onClick,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-200 ease-out outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

    const variantStyles =
      variants[variant] || variants.primary;

    const sizeStyles =
      sizes[size] || sizes.md;

    const widthStyles =
      fullWidth ? "w-full" : "";

    const iconStyles =
      iconOnly
        ? "aspect-square !px-0"
        : "";

    const classes = [
      baseStyles,
      variantStyles,
      sizeStyles,
      widthStyles,
      iconStyles,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const content = (
      <>
        {loading ? (
          <>
            <Spinner />
            <span>
              {typeof children === "string"
                ? "Loading..."
                : children}
            </span>
          </>
        ) : (
          <>
            {leftIcon && (
              <span
                className="shrink-0"
                aria-hidden="true"
              >
                {leftIcon}
              </span>
            )}

            <span>
              {children}
            </span>

            {rightIcon && (
              <span
                className="shrink-0"
                aria-hidden="true"
              >
                {rightIcon}
              </span>
            )}
          </>
        )}
      </>
    );

    const isDisabled =
      disabled || loading;

    if (to) {
      return (
        <Link
          ref={ref}
          to={to}
          className={classes}
          aria-disabled={isDisabled}
          tabIndex={isDisabled ? -1 : undefined}
          onClick={(event) => {
            if (isDisabled) {
              event.preventDefault();
              return;
            }

            onClick?.(event);
          }}
          {...props}
        >
          {content}
        </Link>
      );
    }

    if (href) {
      return (
        <a
          ref={ref}
          href={href}
          className={classes}
          aria-disabled={isDisabled}
          tabIndex={isDisabled ? -1 : undefined}
          onClick={(event) => {
            if (isDisabled) {
              event.preventDefault();
              return;
            }

            onClick?.(event);
          }}
          {...props}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={classes}
        onClick={onClick}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;