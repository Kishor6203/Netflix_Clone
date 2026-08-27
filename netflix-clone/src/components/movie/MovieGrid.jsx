import React, { memo } from "react";
import MovieCard from "./MovieCard";

const GridSkeleton = () => (
  <div>
    <div className="aspect-[2/3] animate-pulse rounded-md bg-zinc-800" />
    <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-zinc-800" />
  </div>
);

const MovieGrid = ({
  movies = [],
  loading = false,
  error = null,
  onRetry,
  emptyMessage = "No titles found.",
  columns = "default",
  showType = false,
}) => {
  const gridClasses = {
    large: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
    compact: "grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7",
    default:
      "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
  }[columns];

  const gridClass = `grid gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 ${gridClasses}`;

  if (loading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: 12 }, (_, i) => (
          <GridSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-lg bg-zinc-900">
        <div className="text-center">
          <h3 className="font-semibold text-white">Something went wrong</h3>
          <p className="mt-2 text-sm text-zinc-500">
            We couldn't load the titles.
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-5 rounded bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-white/5 bg-zinc-950">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
            🎬
          </div>
          <p className="text-sm text-zinc-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={gridClass}>
      {movies.map((movie, index) => (
        <MovieCard
          key={`${movie.media_type || "movie"}-${movie.id}`}
          movie={movie}
          priority={index < 6}
          showType={showType}
        />
      ))}
    </div>
  );
};

export default memo(MovieGrid);