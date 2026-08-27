import React, {
    memo,
    useEffect,
    useRef,
    useState,
  } from "react";
  
  import {
    Search,
    X,
    Loader2,
  } from "lucide-react";
  
  const SearchBar = ({
    value = "",
    onChange,
    onSubmit,
    onClear,
    loading = false,
    placeholder = "Search for movies, shows, genres...",
    autoFocus = false,
    className = "",
  }) => {
    const inputRef =
      useRef(null);
  
    const [focused, setFocused] =
      useState(false);
  
    useEffect(() => {
      if (autoFocus) {
        inputRef.current?.focus();
      }
    }, [autoFocus]);
  
    const handleSubmit = (
      event
    ) => {
      event.preventDefault();
  
      const query =
        value.trim();
  
      if (!query) return;
  
      onSubmit?.(query);
    };
  
    const handleClear = () => {
      onClear?.();
  
      inputRef.current?.focus();
    };
  
    return (
      <form
        onSubmit={handleSubmit}
        className={`
          relative
          flex
          h-10
          items-center
          rounded-md
          border
          transition-all
          duration-200
          ${
            focused
              ? "border-white bg-black"
              : "border-white/30 bg-black/70"
          }
          ${className}
        `}
      >
        <Search
          size={18}
          className="
            ml-3
            shrink-0
            text-zinc-400
          "
        />
  
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(event) =>
            onChange?.(
              event.target.value
            )
          }
          onFocus={() =>
            setFocused(true)
          }
          onBlur={() =>
            setFocused(false)
          }
          placeholder={placeholder}
          autoComplete="off"
          spellCheck="false"
          className="
            min-w-0
            flex-1
            bg-transparent
            px-3
            text-sm
            text-white
            outline-none
            placeholder:text-zinc-500
          "
          aria-label="Search"
        />
  
        {loading && (
          <Loader2
            size={17}
            className="
              mr-2
              animate-spin
              text-zinc-400
            "
          />
        )}
  
        {!loading &&
          value && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="
                mr-2
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-full
                text-zinc-400
                transition
                hover:bg-white/10
                hover:text-white
              "
            >
              <X size={16} />
            </button>
          )}
      </form>
    );
  };
  
  export default memo(SearchBar);