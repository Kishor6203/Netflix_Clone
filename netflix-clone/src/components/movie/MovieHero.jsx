import React, { memo, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Info, Play, Plus, Star } from "lucide-react";

import useMyList from "../../hooks/useMyList";
import usePlayer from "../../hooks/usePlayer";
import { getMovieTitle, truncateText } from "../../utils/helpers";
import { IMAGE_BASE_URL, PLACEHOLDER_IMAGE } from "../../utils/constants";

const getYear = (movie) => {
  const date = movie?.release_date || movie?.first_air_date;
  return date ? new Date(date).getFullYear() : null;
};

const MovieHero = ({ movie, loading = false }) => {
  const navigate = useNavigate();
  const { toggleMyList, isInMyList } = useMyList();
  const { openMedia } = usePlayer();

  const title = useMemo(() => getMovieTitle(movie), [movie]);
  const year = useMemo(() => getYear(movie), [movie]);
  const inMyList = movie?.id ? isInMyList(movie.id) : false;
  const rating = Number(movie?.vote_average || 0);

  const backdrop = movie?.backdrop_path
    ? `${IMAGE_BASE_URL}${movie.backdrop_path}`
    : PLACEHOLDER_IMAGE;

  const handlePlay = useCallback(() => {
    if (movie) openMedia(movie, { autoplay: true });
  }, [movie, openMedia]);

  const handleList = useCallback(() => {
    if (movie) toggleMyList(movie);
  }, [movie, toggleMyList]);

  const handleMoreInfo = useCallback(() => {
    if (!movie?.id) return;

    const type = movie.media_type || (movie.first_air_date ? "tv" : "movie");
    navigate(`/${type === "tv" ? "tv" : "movie"}/${movie.id}`);
  }, [movie, navigate]);

  if (loading) {
    return (
      <section className="relative h-[70vh] min-h-[520px] animate-pulse bg-zinc-900">
        <div className="absolute inset-0 bg-zinc-800" />
        <div className="absolute bottom-16 left-4 max-w-xl sm:left-8 lg:left-12">
          <div className="h-12 w-80 rounded bg-zinc-700" />
          <div className="mt-5 h-4 w-96 rounded bg-zinc-700" />
          <div className="mt-3 h-4 w-72 rounded bg-zinc-700" />
        </div>
      </section>
    );
  }

  if (!movie) return null;

  return (
    <section className="relative min-h-[560px] overflow-hidden md:min-h-[680px] lg:h-[78vh]">
      <img
        src={backdrop}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#111] via-black/60 to-transparent" />

      <div className="relative z-10 flex min-h-[560px] items-end px-4 pb-20 sm:px-8 md:min-h-[680px] md:pb-28 lg:px-12">
        <div className="max-w-xl lg:max-w-2xl">
          {movie.media_type && (
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-zinc-300">
              {movie.media_type === "tv" ? "TV Series" : "Movie"}
            </p>
          )}

          <h1 className="text-4xl font-black leading-none tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-medium text-zinc-200">
            {year && <span>{year}</span>}

            {rating > 0 && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star size={14} fill="currentColor" />
                  {rating.toFixed(1)}
                </span>
              </>
            )}

            {movie.adult && (
              <>
                <span>•</span>
                <span className="border border-zinc-500 px-1">18+</span>
              </>
            )}

            <span>•</span>
            <span>HD</span>
          </div>

          <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-200 sm:text-base sm:leading-7">
            {truncateText(movie.overview || "No description available.", 260)}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handlePlay}
              className="flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-zinc-200 active:scale-95"
            >
              <Play size={19} fill="currentColor" />
              Play
            </button>

            <button
              type="button"
              onClick={handleList}
              className="flex items-center gap-2 rounded-md bg-zinc-700/80 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-zinc-600 active:scale-95"
            >
              {inMyList ? <Check size={19} /> : <Plus size={19} />}
              {inMyList ? "My List" : "Add to My List"}
            </button>

            <button
              type="button"
              onClick={handleMoreInfo}
              className="flex items-center gap-2 rounded-md bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              <Info size={19} />
              More Info
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(MovieHero);