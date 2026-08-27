import React, { memo } from "react";
import { Search, Film } from "lucide-react";

import MovieGrid from "../movie/MovieGrid";

const EmptyState = ({ icon: Icon, title, children }) => (
  <div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
      <Icon size={28} className="text-zinc-500" />
    </div>

    <h2 className="mt-5 text-lg font-semibold text-white">
      {title}
    </h2>

    <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
      {children}
    </p>
  </div>
);

const SearchResults = ({
  query = "",
  results = [],
  loading = false,
  error = null,
  onRetry,
}) => {
  const search = query.trim();

  if (!search && !loading) {
    return (
      <EmptyState
        icon={Search}
        title="Search for something to watch"
      >
        Find movies, TV shows, documentaries and more.
      </EmptyState>
    );
  }

  if (search && !loading && !error && !results.length) {
    return (
      <EmptyState
        icon={Film}
        title="No results found"
      >
        We couldn't find anything matching "{query}".
      </EmptyState>
    );
  }

  return (
    <div>
      {search && (
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white sm:text-2xl">
            Results for{" "}
            <span className="text-zinc-400">"{query}"</span>
          </h1>

          {!loading && results.length > 0 && (
            <span className="hidden text-sm text-zinc-500 sm:block">
              {results.length} results
            </span>
          )}
        </header>
      )}

      <MovieGrid
        movies={results}
        loading={loading}
        error={error}
        onRetry={onRetry}
        showType
        emptyMessage="No results found."
      />
    </div>
  );
};

export default memo(SearchResults);