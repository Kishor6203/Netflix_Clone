import React, { memo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Info, MoreHorizontal, Play, Plus, Star } from "lucide-react";

import useMyList from "../../hooks/useMyList";
import usePlayer from "../../hooks/usePlayer";
import { getMovieTitle } from "../../utils/helpers";
import { PLACEHOLDER_IMAGE, POSTER_BASE_URL } from "../../utils/constants";

const getYear = (item) => {
  const date = item?.release_date || item?.first_air_date;
  return date ? new Date(date).getFullYear() : null;
};

const getMediaType = (item) =>
  item?.media_type || (item?.first_air_date ? "tv" : "movie");

const MovieCard = ({
  movie,
  variant = "default",
  showControls = true,
  showRating = true,
  showType = false,
  priority = false,
  onSelect,
}) => {
  const navigate = useNavigate();
  const { toggleMyList, isInMyList } = useMyList();
  const { openMedia } = usePlayer();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const title = getMovieTitle(movie);
  const year = getYear(movie);
  const mediaType = getMediaType(movie);
  const rating = Number(movie?.vote_average || 0);
  const inMyList = isInMyList(movie?.id);

  const poster =
    !movie?.poster_path || imageError
      ? PLACEHOLDER_IMAGE
      : `${POSTER_BASE_URL}${movie.poster_path}`;

  const handlePlay = useCallback(
    (e) => {
      e?.preventDefault();
      e?.stopPropagation();
      openMedia(movie, { autoplay: true });
    },
    [movie, openMedia]
  );

  const handleMyList = useCallback(
    (e) => {
      e?.preventDefault();
      e?.stopPropagation();
      toggleMyList(movie);
      setMenuOpen(false);
    },
    [movie, toggleMyList]
  );

  const handleDetails = useCallback(
    (e) => {
      e?.preventDefault();
      e?.stopPropagation();
      setMenuOpen(false);

      if (onSelect) return onSelect(movie);

      navigate(`/${mediaType === "tv" ? "tv" : "movie"}/${movie.id}`);
    },
    [movie, mediaType, navigate, onSelect]
  );

  const cardWidth =
    variant === "compact"
      ? "w-[140px] sm:w-[160px]"
      : variant === "large"
        ? "w-[190px] sm:w-[220px] lg:w-[240px]"
        : "w-[160px] sm:w-[180px] lg:w-[200px]";

  return (
    <article className={`group relative shrink-0 ${cardWidth} cursor-pointer select-none`}>
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-zinc-900 shadow-lg transition-all duration-300 ease-out group-hover:z-20 group-hover:scale-[1.04] group-focus-within:z-20 group-focus-within:scale-[1.04]">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-zinc-800" />
        )}

        <img
          src={poster}
          alt={title}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

        {showRating && rating > 0 && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-black/75 px-2 py-1 text-xs font-semibold text-white backdrop-blur">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            {rating.toFixed(1)}
          </div>
        )}

        {showType && (
          <div className="absolute right-2 top-2 rounded bg-black/75 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
            {mediaType}
          </div>
        )}

        {showControls && (
          <div className="absolute inset-x-0 bottom-0 flex translate-y-2 flex-col gap-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={`Play ${title}`}
                onClick={handlePlay}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition hover:scale-110"
              >
                <Play size={16} fill="currentColor" />
              </button>

              <button
                type="button"
                aria-label={
                  inMyList
                    ? `Remove ${title} from My List`
                    : `Add ${title} to My List`
                }
                onClick={handleMyList}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-black/60 text-white backdrop-blur transition hover:scale-110 hover:bg-white hover:text-black"
              >
                {inMyList ? <Check size={16} /> : <Plus size={16} />}
              </button>

              <button
                type="button"
                aria-label={`More information about ${title}`}
                onClick={handleDetails}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-black/60 text-white backdrop-blur transition hover:scale-110 hover:bg-white hover:text-black"
              >
                <Info size={16} />
              </button>

              <button
                type="button"
                aria-label="More options"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMenuOpen((open) => !open);
                }}
                className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white backdrop-blur"
              >
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        )}

        {menuOpen && (
          <div className="absolute bottom-14 right-3 z-30 min-w-[150px] overflow-hidden rounded-md border border-white/10 bg-zinc-950 p-1 shadow-2xl">
            <button
              type="button"
              onClick={handleMyList}
              className="w-full rounded px-3 py-2 text-left text-sm text-white hover:bg-white/10"
            >
              {inMyList ? "Remove from My List" : "Add to My List"}
            </button>

            <button
              type="button"
              onClick={handleDetails}
              className="w-full rounded px-3 py-2 text-left text-sm text-white hover:bg-white/10"
            >
              View details
            </button>
          </div>
        )}
      </div>

      <div className="mt-2 px-0.5">
        <h3
          className="truncate text-sm font-medium text-white"
          title={title}
        >
          {title}
        </h3>

        <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
          {year && (
            <>
              <span>{year}</span>
              <span>•</span>
            </>
          )}
          <span className="uppercase">{mediaType}</span>
        </div>
      </div>
    </article>
  );
};

export default memo(MovieCard);