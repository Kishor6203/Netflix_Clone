import React from "react";
import Button from "./Button";

const EmptyState = ({
  icon,
  title = "Nothing here yet",
  message = "There is nothing to display right now.",
  actionLabel,
  onAction,
  actionTo,
  className = "",
}) => {
  return (
    <div
      className={[
        "flex min-h-[350px] w-full flex-col items-center justify-center px-6 py-16 text-center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
        {icon || (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="h-9 w-9 text-zinc-500"
          >
            <path
              d="M4 5h16v14H4z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M8 9h8M8 13h5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>

      <h2 className="text-xl font-bold text-white">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
        {message}
      </p>

      {(actionLabel && onAction) ||
      (actionLabel && actionTo) ? (
        <Button
          variant="netflix"
          size="md"
          className="mt-6"
          onClick={onAction}
          to={actionTo}
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};

export default EmptyState;