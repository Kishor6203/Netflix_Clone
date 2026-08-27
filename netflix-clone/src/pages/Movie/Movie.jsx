import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Clock,
  Play,
  Plus,
  Star,
  Users,
  RefreshCw,
} from "lucide-react";

import MovieRow from "../../components/movie/MovieRow";
import useMyList from "../../hooks/useMyList";
import usePlayer from "../../hooks/usePlayer";
import useMediaDetails from "../../hooks/useMediaDetails";

import {
  IMAGE_BASE_URL,
  PLACEHOLDER_IMAGE,
  POSTER_BASE_URL,
} from "../../utils/constants";

const Movie = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: movie,
    loading,
    error,
    refetch,
  } = useMediaDetails(id, "movie");

  const { toggleMyList, isInMyList } = useMyList();
  const { openMedia } = usePlayer();

  const inMyList = movie?.id
    ? isInMyList(movie.id)
    : false;

  const trailer = useMemo(() => {
    return (
      movie?.videos?.results?.find(
        (video) =>
          video.site === "YouTube" &&
          video.type === "Trailer"
      ) ||
      movie?.videos?.results?.find(
        (video) =>
          video.site === "YouTube" &&
          video.type === "Teaser"
      ) ||
      null
    );
  }, [movie]);

  const recommendations =
    movie?.recommendations?.results || [];

  const similar =
    movie?.similar?.results || [];

  const cast =
    movie?.credits?.cast || [];

  const releaseYear = movie?.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  const backdrop = movie?.backdrop_path
    ? `${IMAGE_BASE_URL}${movie.backdrop_path}`
    : null;

  const poster = movie?.poster_path
    ? `${POSTER_BASE_URL}${movie.poster_path}`
    : PLACEHOLDER_IMAGE;

  const formattedRuntime = useMemo(() => {
    if (!movie?.runtime) return null;

    const hours = Math.floor(movie.runtime / 60);
    const minutes = movie.runtime % 60;

    if (hours && minutes) {
      return `${hours}h ${minutes}m`;
    }

    if (hours) {
      return `${hours}h`;
    }

    return `${minutes}m`;
  }, [movie?.runtime]);

  const handlePlay = () => {
    if (!movie) return;

    openMedia(movie, {
      autoplay: true,
    });
  };

  const handleTrailer = () => {
    if (!trailer?.key) return;

    window.open(
      `https://www.youtube.com/watch?v=${trailer.key}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /*
   * Loading
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-[#141414] text-white">
        <section className="relative min-h-[650px] overflow-hidden bg-zinc-950">
          <div className="absolute inset-0 animate-pulse bg-zinc-900" />

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

          <div className="relative z-10 mx-auto flex min-h-[650px] max-w-7xl items-end px-4 pb-20 pt-32 sm:px-6 lg:px-10">
            <div className="w-full max-w-3xl">
              <div className="mb-8 h-5 w-20 animate-pulse rounded bg-zinc-800" />

              <div className="h-14 w-3/4 animate-pulse rounded bg-zinc-800" />

              <div className="mt-5 h-5 w-1/2 animate-pulse rounded bg-zinc-800" />

              <div className="mt-7 flex gap-3">
                <div className="h-12 w-28 animate-pulse rounded bg-zinc-800" />
                <div className="h-12 w-32 animate-pulse rounded bg-zinc-800" />
              </div>

              <div className="mt-7 space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-zinc-800" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-800" />
                <div className="h-4 w-4/6 animate-pulse rounded bg-zinc-800" />
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  /*
   * Error
   */
  if (error || !movie) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#141414] px-4 pt-20 text-white">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold">
            Movie unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            {error ||
              "This movie could not be found."}
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={refetch}
              className="flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-bold text-black transition hover:bg-zinc-200"
            >
              <RefreshCw size={16} />
              Try again
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-md bg-zinc-800 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-zinc-700"
            >
              Go back
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#141414] text-white">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative min-h-[650px] overflow-hidden">
        {backdrop ? (
          <img
            src={backdrop}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-zinc-900" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30" />

        <div className="relative z-10 mx-auto flex min-h-[650px] max-w-7xl items-end px-4 pb-20 pt-32 sm:px-6 lg:px-10">
          <div className="max-w-3xl">
            {/* Back */}

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-8 flex items-center gap-2 text-sm text-zinc-300 transition hover:text-white"
            >
              <ArrowLeft size={17} />
              Back
            </button>

            {/* Title */}

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              {movie.title}
            </h1>

            {/* Metadata */}

            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-zinc-300">
              {releaseYear && (
                <span>{releaseYear}</span>
              )}

              {movie.vote_average > 0 && (
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star
                    size={15}
                    fill="currentColor"
                  />

                  {movie.vote_average.toFixed(1)}
                </span>
              )}

              {formattedRuntime && (
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {formattedRuntime}
                </span>
              )}

              <span className="rounded border border-white/20 px-1.5 py-0.5 text-xs">
                HD
              </span>

              {movie.adult && (
                <span className="rounded border border-white/20 px-1.5 py-0.5 text-xs">
                  18+
                </span>
              )}
            </div>

            {/* Actions */}

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handlePlay}
                className="flex items-center gap-2 rounded-md bg-white px-6 py-3 font-bold text-black transition hover:bg-zinc-200"
              >
                <Play
                  size={19}
                  fill="currentColor"
                />
                Play
              </button>

              <button
                type="button"
                onClick={() => toggleMyList(movie)}
                className="flex items-center gap-2 rounded-md bg-white/10 px-6 py-3 font-bold backdrop-blur transition hover:bg-white/20"
              >
                {inMyList ? (
                  <Check size={19} />
                ) : (
                  <Plus size={19} />
                )}

                {inMyList
                  ? "In My List"
                  : "My List"}
              </button>

              {trailer && (
                <button
                  type="button"
                  onClick={handleTrailer}
                  className="rounded-md bg-white/10 px-6 py-3 font-bold backdrop-blur transition hover:bg-white/20"
                >
                  Watch trailer
                </button>
              )}
            </div>

            {/* Overview */}

            <p className="mt-7 max-w-2xl text-sm leading-7 text-zinc-200 sm:text-base">
              {movie.overview ||
                "No description available."}
            </p>

            {/* Genres */}

            {movie.genres?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          INFORMATION
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <img
            src={poster}
            alt={movie.title}
            className="hidden w-full rounded-lg object-cover shadow-2xl lg:block"
            loading="lazy"
          />

          <div>
            <h2 className="text-xl font-bold">
              About this movie
            </h2>

            <dl className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-zinc-500">
                  Original title
                </dt>

                <dd className="mt-1 text-zinc-200">
                  {movie.original_title ||
                    movie.title ||
                    "Unknown"}
                </dd>
              </div>

              <div>
                <dt className="text-zinc-500">
                  Release date
                </dt>

                <dd className="mt-1 text-zinc-200">
                  {movie.release_date ||
                    "Unknown"}
                </dd>
              </div>

              <div>
                <dt className="text-zinc-500">
                  Runtime
                </dt>

                <dd className="mt-1 text-zinc-200">
                  {formattedRuntime ||
                    "Unknown"}
                </dd>
              </div>

              <div>
                <dt className="text-zinc-500">
                  Rating
                </dt>

                <dd className="mt-1 text-zinc-200">
                  {movie.vote_average
                    ? movie.vote_average.toFixed(1)
                    : "N/A"}
                </dd>
              </div>

              <div>
                <dt className="text-zinc-500">
                  Vote count
                </dt>

                <dd className="mt-1 text-zinc-200">
                  {movie.vote_count
                    ? movie.vote_count.toLocaleString()
                    : "N/A"}
                </dd>
              </div>

              {movie.original_language && (
                <div>
                  <dt className="text-zinc-500">
                    Language
                  </dt>

                  <dd className="mt-1 uppercase text-zinc-200">
                    {movie.original_language}
                  </dd>
                </div>
              )}

              {movie.status && (
                <div>
                  <dt className="text-zinc-500">
                    Status
                  </dt>

                  <dd className="mt-1 text-zinc-200">
                    {movie.status}
                  </dd>
                </div>
              )}

              {movie.tagline && (
                <div className="sm:col-span-2">
                  <dt className="text-zinc-500">
                    Tagline
                  </dt>

                  <dd className="mt-1 italic text-zinc-200">
                    "{movie.tagline}"
                  </dd>
                </div>
              )}
            </dl>

            {/* Production companies */}

            {movie.production_companies?.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-zinc-400">
                  Production
                </h3>

                <div className="mt-3 flex flex-wrap gap-3">
                  {movie.production_companies.map(
                    (company) => (
                      <span
                        key={company.id}
                        className="rounded-md bg-zinc-900 px-3 py-2 text-xs text-zinc-400"
                      >
                        {company.name}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          CAST
      ===================================================== */}

      {cast.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-10">
          <h2 className="mb-5 text-xl font-bold">
            Cast
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none">
            {cast
              .slice(0, 12)
              .map((person) => (
                <div
                  key={person.id}
                  className="w-28 shrink-0"
                >
                  <div className="aspect-[2/3] overflow-hidden rounded-lg bg-zinc-900">
                    {person.profile_path ? (
                      <img
                        src={`${POSTER_BASE_URL}${person.profile_path}`}
                        alt={person.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-zinc-700">
                        <Users size={28} />
                      </div>
                    )}
                  </div>

                  <p className="mt-2 truncate text-sm font-medium">
                    {person.name}
                  </p>

                  <p className="truncate text-xs text-zinc-500">
                    {person.character ||
                      "Unknown role"}
                  </p>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* =====================================================
          RECOMMENDATIONS
      ===================================================== */}

      {recommendations.length > 0 && (
        <MovieRow
          title="More Like This"
          movies={recommendations}
          showType
        />
      )}

      {/* =====================================================
          SIMILAR
      ===================================================== */}

      {similar.length > 0 && (
        <MovieRow
          title="Similar Movies"
          movies={similar}
          showType
        />
      )}

      <div className="h-10" />
    </main>
  );
};

export default Movie;