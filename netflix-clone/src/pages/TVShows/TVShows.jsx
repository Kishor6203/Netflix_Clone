import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import MovieGrid from "../../components/movie/MovieGrid";
import useMovies from "../../hooks/useMovies";

const FILTERS = [
  ["popularTV", "Popular"],
  ["topRatedTV", "Top Rated"],
  ["indianTV", "Indian"],
  ["indianTVPopular", "Indian Popular"],
  ["indianTVTopRated", "Indian Top Rated"],
  ["indianTVTrending", "Trending"],
  ["indianDramaTV", "Drama"],
  ["indianComedyTV", "Comedy"],
  ["indianCrimeTV", "Crime"],
  ["indianActionTV", "Action"],
];

const TVShows = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);

  const selected = searchParams.get("category") || "popularTV";

  const {
    categoryData = {},
    categoryLoading = {},
    categoryErrors = {},
    loadCategory,
  } = useMovies();

  useEffect(() => {
    loadCategory(selected, page).catch(() => {});
  }, [selected, page, loadCategory]);

  useEffect(() => {
    setPage(1);
  }, [selected]);

  const data = categoryData[selected];
  const loading = categoryLoading[selected];
  const shows = (data?.results || []).map((show) => ({
    ...show,
    media_type: "tv",
  }));

  const filter = FILTERS.find(([key]) => key === selected);
  const title = filter?.[1] || "TV Shows";

  return (
    <main className="min-h-screen bg-[#141414] px-4 pb-20 pt-24 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-500">
          Browse
        </p>

        <h1 className="mt-2 text-3xl font-black sm:text-4xl">
          TV Shows
        </h1>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {FILTERS.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSearchParams({ category: key })}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                selected === key
                  ? "bg-white text-black"
                  : "bg-white/10 text-zinc-300 hover:bg-white/20"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <h2 className="mb-6 mt-8 text-xl font-bold">
          {title}
        </h2>

        <MovieGrid
          movies={shows}
          loading={loading}
          error={categoryErrors[selected]}
          onRetry={() => loadCategory(selected, page)}
          showType
        />

        {data?.total_pages > page && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              disabled={loading}
              onClick={() => setPage((value) => value + 1)}
              className="rounded-md bg-white px-6 py-3 text-sm font-bold text-black disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default TVShows;