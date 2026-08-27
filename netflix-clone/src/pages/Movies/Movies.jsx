import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import MovieGrid from "../../components/movie/MovieGrid";
import useMovies from "../../hooks/useMovies";

const FILTERS = [
  { key: "popular", label: "Popular" },
  { key: "topRated", label: "Top Rated" },
  { key: "nowPlaying", label: "Now Playing" },
  { key: "upcoming", label: "Upcoming" },
  { key: "action", label: "Action" },
  { key: "comedy", label: "Comedy" },
  { key: "horror", label: "Horror" },
  { key: "romance", label: "Romance" },
  { key: "thriller", label: "Thriller" },
  { key: "animation", label: "Animation" },
  { key: "sciFi", label: "Sci-Fi" },
  { key: "indianMovies", label: "Indian" },
];

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = searchParams.get("category") || "popular";

  const {
    categoryData = {},
    categoryLoading = {},
    categoryErrors = {},
    loadCategory,
  } = useMovies();

  const [page, setPage] = useState(1);

  useEffect(() => {
    loadCategory(selected, page).catch(() => {});
  }, [selected, page, loadCategory]);

  useEffect(() => {
    setPage(1);
  }, [selected]);

  const data = categoryData[selected];
  const movies = data?.results || [];
  const title =
    FILTERS.find((filter) => filter.key === selected)?.label || "Movies";

  const selectFilter = useCallback(
    (key) => setSearchParams({ category: key }),
    [setSearchParams]
  );

  const nextPage = () => {
    if (data?.total_pages && page >= data.total_pages) return;
    setPage((current) => current + 1);
  };

  const isLoading = categoryLoading[selected];

  return (
    <main className="min-h-screen bg-[#141414] px-4 pb-20 pt-24 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-500">
            Browse
          </p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Movies</h1>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {FILTERS.map((filter) => {
            const active = filter.key === selected;

            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => selectFilter(filter.key)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-white text-black"
                    : "bg-white/10 text-zinc-300 hover:bg-white/20 hover:text-white"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="mb-5">
          <h2 className="text-xl font-bold">{title}</h2>
          {data?.total_results && (
            <p className="mt-1 text-sm text-zinc-500">
              {data.total_results.toLocaleString()} titles
            </p>
          )}
        </div>

        <MovieGrid
          movies={movies}
          loading={isLoading}
          error={categoryErrors[selected]}
          onRetry={() => loadCategory(selected, page)}
        />

        {data?.total_pages > page && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={nextPage}
              disabled={isLoading}
              className="rounded-md bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Movies;