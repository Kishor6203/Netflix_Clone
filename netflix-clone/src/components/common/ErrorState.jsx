import React from "react";
import Button from "./Button";

const ErrorState = ({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
  retryLabel = "Try again",
  fullScreen = false,
  className = "",
}) => {
  return (
    <div
      className={[
        "flex w-full flex-col items-center justify-center px-6 py-16 text-center",
        fullScreen
          ? "min-h-[70vh]"
          : "min-h-[300px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="alert"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-600/10">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-8 w-8 text-red-500"
        >
          <path
            d="M12 9v4"
            strokeLinecap="round"
          />

          <path
            d="M12 17h.01"
            strokeLinecap="round"
          />

          <path
            d="M10.3 3.8L2.7 17a2 2 0 001.7 3h15.2a2 2 0 001.7-3L13.7 3.8a2 2 0 00-3.4 0z"
          />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-white">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">
        {message}
      </p>

      {onRetry && (
        <Button
          variant="netflix"
          size="md"
          className="mt-6"
          onClick={onRetry}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;