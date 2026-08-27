import { memo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import MovieCard from "./MovieCard";

const SkeletonCard = () => (
  <div className="w-[160px] shrink-0 sm:w-[180px] lg:w-[200px]">
    <div className="aspect-[2/3] animate-pulse rounded-md bg-zinc-800" />
    <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-zinc-800" />
  </div>
);

const MovieRow = ({
  title,
  movies = [],
  loading = false,
  error,
  onRetry,
  onSeeAll,
  variant = "default",
  showType = false,
}) => {
  const containerRef = useRef(null);

  const scroll = (direction) => {
    const el = containerRef.current;
    if (!el) return;

    el.scrollBy({
      left: (direction === "left" ? -1 : 1) * el.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  const handleKeyDown = (e) => {
    if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
    e.preventDefault();
    scroll(e.key === "ArrowLeft" ? "left" : "right");
  };

  const hasMovies = movies.length > 0;

  return (
    <section className="relative mb-8 md:mb-10">
      <header className="mb-3 flex items-center justify-between px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white sm:text-xl lg:text-2xl">
            {title}
          </h2>

          {onSeeAll && (
            <button
              type="button"
              onClick={onSeeAll}
              className="hidden text-sm font-semibold text-zinc-400 hover:text-white sm:block"
            >
              See all
            </button>
          )}
        </div>

        {!loading && hasMovies && (
          <div className="hidden gap-1 sm:flex">
            <button
              type="button"
              aria-label={`Scroll ${title} left`}
              onClick={() => scroll("left")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              aria-label={`Scroll ${title} right`}
              onClick={() => scroll("right")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </header>

      {error && !loading ? (
        <div className="mx-4 flex min-h-[180px] items-center justify-center rounded-lg bg-zinc-900 sm:mx-6 lg:mx-10">
          <div className="text-center">
            <p className="text-sm text-zinc-400">
              Unable to load this section.
            </p>

            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-3 rounded bg-white px-4 py-2 text-sm font-semibold text-black"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="flex gap-3 overflow-x-auto px-4 pb-3 scrollbar-none focus:outline-none sm:gap-4 sm:px-6 lg:gap-5 lg:px-10"
          style={{ scrollbarWidth: "none" }}
        >
          {loading ? (
            Array.from({ length: 7 }, (_, i) => (
              <SkeletonCard key={i} />
            ))
          ) : hasMovies ? (
            movies.map((movie) => (
              <MovieCard
                key={`${movie.media_type || "movie"}-${movie.id}`}
                movie={movie}
                variant={variant}
                showType={showType}
              />
            ))
          ) : (
            <div className="flex min-h-[150px] w-full items-center justify-center text-sm text-zinc-500">
              No titles available.
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default memo(MovieRow);