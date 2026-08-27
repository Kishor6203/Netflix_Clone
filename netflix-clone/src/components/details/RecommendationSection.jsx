import React, { memo } from "react";

import MovieCard from "../movie/MovieCard";

const RecommendationSection = ({
  movies = [],
  title = "You May Also Like",
  limit = 10,
}) => {
  const items = Array.isArray(movies)
    ? movies
        .filter((movie) => movie?.id)
        .slice(0, limit)
    : [];

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#141414] px-4 pb-20 pt-12 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
            Recommended
          </p>

          <h2 className="mt-2 text-2xl font-black sm:text-3xl">
            {title}
          </h2>
        </div>

        <div
          className="
            mt-7
            flex
            gap-4
            overflow-x-auto
            pb-5
            scrollbar-hide
          "
        >
          {items.map((movie, index) => (
            <MovieCard
              key={`${movie.id}-${index}`}
              movie={movie}
              variant="default"
              showControls
              showRating
              priority={index < 4}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(RecommendationSection);