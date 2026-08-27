import React, {
    useEffect,
    useRef,
  } from "react";
  import { createPortal } from "react-dom";
  
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-7xl",
  };
  
  const Modal = ({
    open,
    onClose,
    title,
    description,
    children,
    footer,
    size = "md",
    closeOnOverlay = true,
    closeOnEscape = true,
    showCloseButton = true,
    className = "",
  }) => {
    const modalRef = useRef(null);
    const previousActiveElement =
      useRef(null);
  
    useEffect(() => {
      if (!open) return;
  
      previousActiveElement.current =
        document.activeElement;
  
      const originalOverflow =
        document.body.style.overflow;
  
      document.body.style.overflow = "hidden";
  
      const handleKeyDown = (event) => {
        if (
          closeOnEscape &&
          event.key === "Escape"
        ) {
          onClose?.();
          return;
        }
  
        if (event.key === "Tab") {
          const modal =
            modalRef.current;
  
          if (!modal) return;
  
          const focusable = modal.querySelectorAll(
            [
              "button",
              "[href]",
              "input",
              "select",
              "textarea",
              "[tabindex]:not([tabindex='-1'])",
            ].join(",")
          );
  
          if (!focusable.length) return;
  
          const first = focusable[0];
          const last =
            focusable[focusable.length - 1];
  
          if (
            event.shiftKey &&
            document.activeElement === first
          ) {
            event.preventDefault();
            last.focus();
          } else if (
            !event.shiftKey &&
            document.activeElement === last
          ) {
            event.preventDefault();
            first.focus();
          }
        }
      };
  
      document.addEventListener(
        "keydown",
        handleKeyDown
      );
  
      requestAnimationFrame(() => {
        const firstFocusable =
          modalRef.current?.querySelector(
            "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
          );
  
        firstFocusable?.focus();
      });
  
      return () => {
        document.body.style.overflow =
          originalOverflow;
  
        document.removeEventListener(
          "keydown",
          handleKeyDown
        );
  
        previousActiveElement.current?.focus?.();
      };
    }, [
      open,
      onClose,
      closeOnEscape,
    ]);
  
    if (!open) {
      return null;
    }
  
    return createPortal(
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        role="presentation"
      >
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              closeOnOverlay &&
              event.target === event.currentTarget
            ) {
              onClose?.();
            }
          }}
          aria-hidden="true"
        />
  
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={
            title
              ? "modal-title"
              : undefined
          }
          aria-describedby={
            description
              ? "modal-description"
              : undefined
          }
          className={[
            "relative z-10 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl",
            sizeClasses[size] ||
              sizeClasses.md,
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {(title ||
            description ||
            showCloseButton) && (
            <div className="flex shrink-0 items-start justify-between gap-6 border-b border-white/10 px-5 py-4 sm:px-6">
              <div className="min-w-0">
                {title && (
                  <h2
                    id="modal-title"
                    className="text-lg font-bold text-white sm:text-xl"
                  >
                    {title}
                  </h2>
                )}
  
                {description && (
                  <p
                    id="modal-description"
                    className="mt-1 text-sm leading-6 text-zinc-400"
                  >
                    {description}
                  </p>
                )}
              </div>
  
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Close dialog"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
  
          <div className="min-h-0 flex-1 overflow-y-auto">
            {children}
          </div>
  
          {footer && (
            <div className="shrink-0 border-t border-white/10 px-5 py-4 sm:px-6">
              {footer}
            </div>
          )}
        </div>
      </div>,
      document.body
    );
  };
  
  export default Modal;