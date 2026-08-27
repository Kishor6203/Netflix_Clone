import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import SearchBar from "../../components/search/SearchBar";
import SearchResults from "../../components/search/SearchResults";
import useDebounce from "../../hooks/useDebounce";
import useMovies from "../../hooks/useMovies";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const debouncedQuery = useDebounce(query, 450);

  const {
    searchResults = [],
    searchLoading,
    searchError,
    search,
    resetSearch,
  } = useMovies();

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (!trimmed) {
      resetSearch?.();
      return;
    }

    setSearchParams({ q: trimmed }, { replace: true });
    search(trimmed).catch(() => {});
  }, [debouncedQuery, search, resetSearch, setSearchParams]);

  const handleClear = () => {
    setQuery("");
    setSearchParams({}, { replace: true });
    resetSearch?.();
  };

  return (
    <main className="min-h-screen bg-[#141414] px-4 pb-20 pt-24 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl">
          <h1 className="mb-5 text-center text-3xl font-black">Search</h1>

          <SearchBar
            value={query}
            onChange={setQuery}
            onClear={handleClear}
            loading={searchLoading}
            autoFocus
            className="h-12 w-full"
          />
        </div>

        <SearchResults
          query={query}
          results={searchResults}
          loading={searchLoading}
          error={searchError}
          onRetry={() => search(debouncedQuery)}
        />
      </div>
    </main>
  );
};

export default Search;