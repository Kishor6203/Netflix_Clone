import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Clock,
  Play,
  Plus,
  Star,
  Users,
} from "lucide-react";

import MovieRow from "../../components/movie/MovieRow";
import useMediaDetails from "../../hooks/useMediaDetails";
import useMyList from "../../hooks/useMyList";
import usePlayer from "../../hooks/usePlayer";

import {
  IMAGE_BASE_URL,
  PLACEHOLDER_IMAGE,
  POSTER_BASE_URL,
} from "../../utils/constants";

const TVDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: show, loading, error, refetch } = useMediaDetails(id, "tv");
  const { toggleMyList, isInMyList } = useMyList();
  const { openMedia } = usePlayer();

  const title = show?.name || show?.original_name || "TV Show";
  const inMyList = show?.id ? isInMyList(show.id) : false;

  const backdrop = show?.backdrop_path
    ? `${IMAGE_BASE_URL}${show.backdrop_path}`
    : null;

  const poster = show?.poster_path
    ? `${POSTER_BASE_URL}${show.poster_path}`
    : PLACEHOLDER_IMAGE;

  const cast = show?.credits?.cast || [];
  const seasons = show?.seasons || [];
  const recommendations = show?.recommendations?.results || [];
  const similar = show?.similar?.results || [];

  const trailer =
    show?.videos?.results?.find(
      (video) => video.site === "YouTube" && video.type === "Trailer"
    ) ||
    show?.videos?.results?.find(
      (video) => video.site === "YouTube" && video.type === "Teaser"
    ) ||
    null;

  const year = show?.first_air_date
    ? new Date(show.first_air_date).getFullYear()
    : null;

  const runtime = show?.episode_run_time?.[0];
  const runtimeText = runtime ? `${runtime}m per episode` : null;

  const handlePlay = () => {
    if (!show) return;
    openMedia(show, { autoplay: true, mediaType: "tv" });
  };

  const handleMyList = () => {
    if (!show) return;
    toggleMyList(show);
  };

  const handleBack = () => navigate(-1);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#141414] text-white">
        <section className="relative min-h-[650px] overflow-hidden bg-zinc-950">
          <div className="absolute inset-0 animate-pulse bg-zinc-900" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

          <div className="relative z-10 mx-auto flex min-h-[650px] max-w-7xl items-end px-4 pb-20 pt-32 sm:px-6 lg:px-10">
            <div className="w-full max-w-3xl">
              <div className="mb-8 h-5 w-20 animate-pulse rounded bg-zinc-800" />
              <div className="h-12 w-3/4 animate-pulse rounded bg-zinc-800 sm:h-16" />
              <div className="mt-6 h-5 w-1/2 animate-pulse rounded bg-zinc-800" />

              <div className="mt-7 flex gap-3">
                <div className="h-12 w-28 animate-pulse rounded bg-zinc-800" />
                <div className="h-12 w-32 animate-pulse rounded bg-zinc-800" />
              </div>

              <div className="mt-7 space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-zinc-800" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-800" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-800" />
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error || !show) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#141414] px-4 text-white">
        <div className="max-w-md text-center">
          <div className="mb-5 text-5xl">😕</div>

          <h1 className="text-2xl font-bold">Show unavailable</h1>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            {error || "This TV show could not be found."}
          </p>

          <div className="mt-7 flex justify-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-md bg-white px-5 py-2.5 text-sm font-bold text-black transition hover:bg-zinc-200"
            >
              Go back
            </button>

            <button
              type="button"
              onClick={refetch}
              className="rounded-md bg-zinc-800 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-zinc-700"
            >
              Try again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#141414] text-white">
      {/* HERO */}
      <section className="relative min-h-[650px] overflow-hidden">
        {backdrop ? (
          <img
            src={backdrop}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-zinc-900" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/20" />

        <div className="relative z-10 mx-auto flex min-h-[650px] max-w-7xl items-end px-4 pb-20 pt-32 sm:px-6 lg:px-10">
          <div className="max-w-3xl">
            <button
              type="button"
              onClick={handleBack}
              className="mb-8 flex items-center gap-2 text-sm text-zinc-300 transition hover:text-white"
            >
              <ArrowLeft size={17} />
              Back
            </button>

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-red-500">
              TV Series
            </p>

            <h1 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
              {title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-zinc-300">
              {year && <span>{year}</span>}

              {show.vote_average > 0 && (
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star size={15} fill="currentColor" />
                  {Number(show.vote_average).toFixed(1)}
                </span>
              )}

              {runtimeText && (
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {runtimeText}
                </span>
              )}

              {show.number_of_seasons > 0 && (
                <span>
                  {show.number_of_seasons}{" "}
                  {show.number_of_seasons === 1 ? "Season" : "Seasons"}
                </span>
              )}

              {show.status && <span>{show.status}</span>}

              <span className="rounded border border-zinc-600 px-1.5 py-0.5 text-[10px] font-bold">
                HD
              </span>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handlePlay}
                className="flex items-center gap-2 rounded-md bg-white px-6 py-3 font-bold text-black transition hover:bg-zinc-200"
              >
                <Play size={19} fill="currentColor" />
                Play
              </button>

              <button
                type="button"
                onClick={handleMyList}
                className="flex items-center gap-2 rounded-md bg-white/10 px-6 py-3 font-bold backdrop-blur transition hover:bg-white/20"
              >
                {inMyList ? <Check size={19} /> : <Plus size={19} />}
                {inMyList ? "In My List" : "My List"}
              </button>

              {trailer?.key && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-md bg-white/10 px-6 py-3 font-bold transition hover:bg-white/20"
                >
                  Watch trailer
                </a>
              )}
            </div>

            <p className="mt-7 max-w-2xl text-sm leading-7 text-zinc-200 sm:text-base">
              {show.overview || "No description available."}
            </p>

            {show.genres?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {show.genres.map((genre) => (
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

      {/* ABOUT */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <img
            src={poster}
            alt={title}
            loading="lazy"
            className="hidden w-full rounded-lg object-cover shadow-2xl lg:block"
          />

          <div>
            <h2 className="text-xl font-bold">About this show</h2>

            <dl className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-zinc-500">Original title</dt>
                <dd className="mt-1 text-zinc-200">
                  {show.original_name || title}
                </dd>
              </div>

              <div>
                <dt className="text-zinc-500">First air date</dt>
                <dd className="mt-1 text-zinc-200">
                  {show.first_air_date || "Unknown"}
                </dd>
              </div>

              <div>
                <dt className="text-zinc-500">Last air date</dt>
                <dd className="mt-1 text-zinc-200">
                  {show.last_air_date || "Unknown"}
                </dd>
              </div>

              <div>
                <dt className="text-zinc-500">Status</dt>
                <dd className="mt-1 text-zinc-200">
                  {show.status || "Unknown"}
                </dd>
              </div>

              <div>
                <dt className="text-zinc-500">Seasons</dt>
                <dd className="mt-1 text-zinc-200">
                  {show.number_of_seasons || "Unknown"}
                </dd>
              </div>

              <div>
                <dt className="text-zinc-500">Episodes</dt>
                <dd className="mt-1 text-zinc-200">
                  {show.number_of_episodes || "Unknown"}
                </dd>
              </div>

              <div>
                <dt className="text-zinc-500">Rating</dt>
                <dd className="mt-1 text-zinc-200">
                  {show.vote_average
                    ? Number(show.vote_average).toFixed(1)
                    : "N/A"}
                </dd>
              </div>

              <div>
                <dt className="text-zinc-500">Language</dt>
                <dd className="mt-1 uppercase text-zinc-200">
                  {show.original_language || "Unknown"}
                </dd>
              </div>
            </dl>

            {show.networks?.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-zinc-400">
                  Networks
                </h3>

                <div className="mt-3 flex flex-wrap gap-4">
                  {show.networks.slice(0, 6).map((network) => (
                    <div
                      key={network.id}
                      className="flex h-12 min-w-20 items-center justify-center rounded bg-zinc-900 px-3"
                    >
                      {network.logo_path ? (
                        <img
                          src={`${IMAGE_BASE_URL}${network.logo_path}`}
                          alt={network.name}
                          className="max-h-7 max-w-16 object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-xs text-zinc-400">
                          {network.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SEASONS */}
      {seasons.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-10">
          <h2 className="mb-6 text-xl font-bold">Seasons</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {seasons.map((season) => (
              <div
                key={season.id}
                className="flex gap-4 rounded-lg bg-zinc-900 p-3 transition hover:bg-zinc-800"
              >
                <div className="h-28 w-20 shrink-0 overflow-hidden rounded bg-zinc-800">
                  {season.poster_path ? (
                    <img
                      src={`${POSTER_BASE_URL}${season.poster_path}`}
                      alt={season.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-zinc-600">
                      No image
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold">{season.name}</h3>

                  <p className="mt-2 text-xs text-zinc-500">
                    {season.episode_count || 0} episodes
                  </p>

                  {season.air_date && (
                    <p className="mt-1 text-xs text-zinc-500">
                      {season.air_date}
                    </p>
                  )}

                  {season.overview && (
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-600">
                      {season.overview}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CAST */}
      {cast.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-10">
          <h2 className="mb-5 text-xl font-bold">Cast</h2>

          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none">
            {cast.slice(0, 12).map((person) => (
              <div key={person.id} className="w-28 shrink-0">
                <div className="aspect-[2/3] overflow-hidden rounded-lg bg-zinc-900">
                  {person.profile_path ? (
                    <img
                      src={`${POSTER_BASE_URL}${person.profile_path}`}
                      alt={person.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
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

                {person.character && (
                  <p className="truncate text-xs text-zinc-500">
                    {person.character}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TRAILER */}
      {trailer?.key && (
        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-10">
          <h2 className="mb-5 text-xl font-bold">Trailer</h2>

          <div className="relative aspect-video max-w-4xl overflow-hidden rounded-xl bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={`${title} trailer`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </section>
      )}

      {/* RECOMMENDATIONS */}
      {recommendations.length > 0 && (
        <MovieRow
          title="You May Also Like"
          movies={recommendations}
          showType
        />
      )}

      {/* SIMILAR */}
      {similar.length > 0 && (
        <MovieRow title="Similar Shows" movies={similar} showType />
      )}

      <div className="h-10" />
    </main>
  );
};

export default TVDetails;