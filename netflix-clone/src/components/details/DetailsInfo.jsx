import React, { memo } from "react";

import { Calendar, Clock, Globe2, Languages, Star } from "lucide-react";

const formatDate = (date) => {
  if (!date) return "Unknown";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Unknown";
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatRuntime = (minutes) => {
  if (!minutes || minutes <= 0) {
    return "Unknown";
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins} minutes`;

  if (mins === 0) return `${hours}h`;

  return `${hours}h ${mins}m`;
};

const DetailsInfo = ({ movie }) => {
  if (!movie) return null;

  const isTV =
    movie.media_type === "tv" ||
    Boolean(movie.first_air_date);

  const releaseDate = isTV
    ? movie.first_air_date
    : movie.release_date;

  const languages =
    movie.spoken_languages || [];

  const countries =
    movie.production_countries || [];

  const genres =
    movie.genres || [];

  return (
    <section className="bg-[#141414] px-4 py-12 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          {/* Main */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
              About this title
            </p>

            <h2 className="mt-2 text-2xl font-black">
              {movie.title ||
                movie.name ||
                "Untitled"}
            </h2>

            {movie.overview && (
              <p className="mt-5 max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">
                {movie.overview}
              </p>
            )}

            {genres.length > 0 && (
              <div className="mt-7">
                <h3 className="text-sm font-bold text-white">
                  Genres
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-zinc-300"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
              Details
            </h3>

            <div className="mt-5 space-y-5">
              <InfoRow
                icon={<Star size={16} />}
                label="Rating"
                value={
                  movie.vote_average
                    ? `${Number(
                        movie.vote_average
                      ).toFixed(1)} / 10`
                    : "Not rated"
                }
              />

              <InfoRow
                icon={<Calendar size={16} />}
                label={isTV ? "First Air Date" : "Release Date"}
                value={formatDate(releaseDate)}
              />

              <InfoRow
                icon={<Clock size={16} />}
                label="Runtime"
                value={
                  isTV
                    ? movie.number_of_seasons
                      ? `${movie.number_of_seasons} season${
                          movie.number_of_seasons > 1
                            ? "s"
                            : ""
                        }`
                      : "Unknown"
                    : formatRuntime(movie.runtime)
                }
              />

              <InfoRow
                icon={<Globe2 size={16} />}
                label="Status"
                value={movie.status || "Unknown"}
              />

              <InfoRow
                icon={<Languages size={16} />}
                label="Language"
                value={
                  languages.length > 0
                    ? languages
                        .slice(0, 3)
                        .map(
                          (item) =>
                            item.english_name ||
                            item.name
                        )
                        .join(", ")
                    : movie.original_language?.toUpperCase() ||
                      "Unknown"
                }
              />
            </div>

            {countries.length > 0 && (
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Production Countries
                </p>

                <p className="mt-2 text-sm text-zinc-300">
                  {countries
                    .map(
                      (country) =>
                        country.name
                    )
                    .join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}) => (
  <div className="flex gap-3">
    <div className="mt-0.5 text-zinc-500">
      {icon}
    </div>

    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </p>

      <p className="mt-1 text-sm text-zinc-200">
        {value}
      </p>
    </div>
  </div>
);

export default memo(DetailsInfo);