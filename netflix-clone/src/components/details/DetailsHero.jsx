import React, { memo, useMemo } from "react";
import { Play, Plus, Check, Star, Clock, Calendar } from "lucide-react";

import useMyList from "../../hooks/useMyList";
import usePlayer from "../../hooks/usePlayer";

import { BACKDROP_BASE_URL, PLACEHOLDER_IMAGE } from "../../utils/constants";
import { getMovieTitle } from "../../utils/helpers";

const getMediaType = (media) => {
  if (media?.media_type === "tv" || media?.media_type === "movie") {
    return media.media_type;
  }

  return media?.first_air_date ? "tv" : "movie";
};

const formatRuntime = (minutes) => {
  if (!minutes || minutes <= 0) return null;

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;

  if (mins === 0) return `${hours}h`;

  return `${hours}h ${mins}m`;
};

const getReleaseDate = (media, type) => {
  return type === "tv"
    ? media?.first_air_date
    : media?.release_date;
};

const formatDate = (date) => {
  if (!date) return null;

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const DetailsHero = ({
  movie,
  onPlay,
  onMyList,
  className = "",
}) => {
  const { toggleMyList, isInMyList } = useMyList();
  const { openMedia } = usePlayer();

  const media = movie;

  const title = useMemo(
    () => getMovieTitle(media) || "Untitled",
    [media]
  );

  const mediaType = useMemo(
    () => getMediaType(media),
    [media]
  );

  const backdrop = media?.backdrop_path
    ? `${BACKDROP_BASE_URL}${media.backdrop_path}`
    : PLACEHOLDER_IMAGE;

  const rating = Number(media?.vote_average || 0);

  const releaseDate = getReleaseDate(
    media,
    mediaType
  );

  const formattedDate = formatDate(releaseDate);

  const runtime = formatRuntime(
    media?.runtime
  );

  const inMyList = isInMyList(media?.id);

  const genres = Array.isArray(media?.genres)
    ? media.genres
    : [];

  const overview =
    media?.overview ||
    "No description is available for this title.";

  const handlePlay = () => {
    if (!media?.id) return;

    if (onPlay) {
      onPlay(media);
      return;
    }

    openMedia(media, {
      autoplay: true,
    });
  };

  const handleMyList = () => {
    if (!media?.id) return;

    if (onMyList) {
      onMyList(media);
      return;
    }

    toggleMyList(media);
  };

  return (
    <section
      className={`relative min-h-[620px] overflow-hidden bg-black ${className}`}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={backdrop}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center"
        />

        {/* Right/Bottom darkening */}
        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/10" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-[620px] items-end">
        <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 lg:px-10">
          <div className="max-w-3xl">
            {/* Type */}
            <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-red-500">
              <span>
                {mediaType === "tv" ? "TV Series" : "Movie"}
              </span>

              <span className="h-1 w-1 rounded-full bg-red-500" />

              <span>TMDB</span>
            </div>

            {/* Title */}
            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
              {title}
            </h1>

            {/* Metadata */}
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-zinc-200">
              {rating > 0 && (
                <span className="flex items-center gap-1.5">
                  <Star
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />

                  {rating.toFixed(1)}
                </span>
              )}

              {formattedDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={15} />
                  {formattedDate}
                </span>
              )}

              {runtime && (
                <span className="flex items-center gap-1.5">
                  <Clock size={15} />
                  {runtime}
                </span>
              )}

              {media?.adult && (
                <span className="rounded border border-zinc-500 px-2 py-0.5 text-xs">
                  18+
                </span>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {genres.slice(0, 5).map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-zinc-200 backdrop-blur"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Tagline */}
            {media?.tagline && (
              <p className="mt-5 text-base font-semibold italic text-zinc-300">
                “{media.tagline}”
              </p>
            )}

            {/* Overview */}
            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
              {overview}
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handlePlay}
                disabled={!media?.id}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-md
                  bg-white
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-black
                  transition
                  hover:bg-zinc-200
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <Play
                  size={18}
                  fill="currentColor"
                />

                Play
              </button>

              <button
                type="button"
                onClick={handleMyList}
                disabled={!media?.id}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-md
                  bg-zinc-700/80
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-white
                  backdrop-blur
                  transition
                  hover:bg-zinc-600
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {inMyList ? (
                  <Check size={18} />
                ) : (
                  <Plus size={18} />
                )}

                {inMyList
                  ? "My List"
                  : "Add to My List"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(DetailsHero);