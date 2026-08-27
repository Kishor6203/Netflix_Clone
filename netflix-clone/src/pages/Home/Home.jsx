import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import MovieHero from "../../components/movie/MovieHero";
import MovieRow from "../../components/movie/MovieRow";
import useMovies from "../../hooks/useMovies";

const HOME_ROWS = [
  { key: "trending", title: "Trending Now" },
  { key: "netflixOriginals", title: "Netflix Originals" },
  { key: "popular", title: "Popular Movies" },
  { key: "topRated", title: "Top Rated" },
  { key: "action", title: "Action Movies" },
  { key: "comedy", title: "Comedy Movies" },
  { key: "horror", title: "Horror Movies" },
  { key: "romance", title: "Romance Movies" },
  { key: "documentaries", title: "Documentaries" },
];

const Home = () => {
  const navigate = useNavigate();
  const {
    categoryData = {},
    categoryLoading = {},
    categoryErrors = {},
    loadCategory,
  } = useMovies();

  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    HOME_ROWS.forEach(({ key }) => {
      if (!categoryData[key] && !categoryLoading[key]) {
        loadCategory(key).catch(() => {});
      }
    });
  }, [categoryData, categoryLoading, loadCategory]);

  const trending = categoryData.trending?.results || [];

  const heroMovies = useMemo(
    () =>
      trending.filter(
        (movie) => movie?.backdrop_path && movie?.overview
      ),
    [trending]
  );

  useEffect(() => {
    if (heroMovies.length <= 1) return;

    const timer = setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroMovies.length);
    }, 12000);

    return () => clearInterval(timer);
  }, [heroMovies.length]);

  const heroMovie =
    heroMovies[heroIndex % Math.max(heroMovies.length, 1)] ||
    trending[0] ||
    null;

  const handleSeeAll = useCallback(
    (key) => {
      const url =
        key === "trending"
          ? "/movies?sort=trending"
          : `/movies?category=${encodeURIComponent(key)}`;

      navigate(url);
    },
    [navigate]
  );

  return (
    <main className="min-h-screen bg-[#141414] text-white">
      <MovieHero
        movie={heroMovie}
        loading={categoryLoading.trending && !heroMovie}
      />

      <div className="relative z-10 -mt-8 space-y-8 pb-16 md:-mt-12">
        {HOME_ROWS.map(({ key, title }) => (
          <MovieRow
            key={key}
            title={title}
            movies={categoryData[key]?.results || []}
            loading={categoryLoading[key]}
            error={categoryErrors[key]}
            onRetry={() => loadCategory(key)}
            onSeeAll={() => handleSeeAll(key)}
          />
        ))}
      </div>
    </main>
  );
};

export default Home;