import { useMemo, useState } from "react";
import { Bookmark } from "lucide-react";

import MovieGrid from "../../components/movie/MovieGrid";
import useMyList from "../../hooks/useMyList";

const FILTERS = [
  ["all", "All"],
  ["movie", "Movies"],
  ["tv", "TV Shows"],
];

const getMediaType = (item) =>
  item?.media_type ||
  (item?.first_air_date ? "tv" : "movie");

const MyList = () => {
  const { items = [], loading = false } = useMyList();
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(
    () =>
      filter === "all"
        ? items
        : items.filter(
            (item) => getMediaType(item) === filter
          ),
    [items, filter]
  );

  const typeLabel =
    filter === "movie" ? "movies" : "TV shows";

  return (
    <main className="min-h-screen bg-[#141414] px-4 pb-20 pt-24 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-500">
              Your collection
            </p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">
              My List
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              {items.length}{" "}
              {items.length === 1 ? "saved title" : "saved titles"}
            </p>
          </div>

          <div className="flex gap-2">
            {FILTERS.map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filter === key
                    ? "bg-white text-black"
                    : "bg-white/10 text-zinc-300 hover:bg-white/20"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </header>

        <div className="mt-10">
          {loading ? (
            <MovieGrid
              movies={[]}
              loading
              emptyMessage="Loading your list..."
              showType
            />
          ) : filtered.length ? (
            <MovieGrid
              movies={filtered}
              emptyMessage="Your list is empty."
              showType
            />
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                <Bookmark size={28} className="text-zinc-500" />
              </div>

              <h2 className="mt-5 text-xl font-bold">
                {filter === "all"
                  ? "Your list is empty"
                  : `No ${typeLabel} in your list`}
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                {filter === "all"
                  ? "Add movies and shows you want to watch later and they'll appear here."
                  : `You haven't added any ${typeLabel} to your list yet.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default MyList;