import React, { memo } from "react";
import { UserRound } from "lucide-react";

import {
  PROFILE_BASE_URL,
  PLACEHOLDER_IMAGE,
} from "../../utils/constants";

const CastSection = ({
  credits,
  limit = 12,
}) => {
  const cast = Array.isArray(credits?.cast)
    ? credits.cast
        .filter((person) => person?.id)
        .slice(0, limit)
    : [];

  if (cast.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#141414] px-4 py-12 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
            Cast
          </p>

          <h2 className="mt-2 text-2xl font-black sm:text-3xl">
            Top Cast
          </h2>
        </div>

        <div
          className="
            mt-7
            grid
            grid-cols-2
            gap-4
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-6
          "
        >
          {cast.map((person) => {
            const image = person.profile_path
              ? `${PROFILE_BASE_URL}${person.profile_path}`
              : PLACEHOLDER_IMAGE;

            return (
              <article
                key={person.id}
                className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]"
              >
                <div className="aspect-[2/3] overflow-hidden bg-zinc-900">
                  <img
                    src={image}
                    alt={person.name || "Cast member"}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-3">
                  <h3
                    className="truncate text-sm font-bold text-white"
                    title={person.name}
                  >
                    {person.name || "Unknown"}
                  </h3>

                  <p
                    className="mt-1 truncate text-xs text-zinc-500"
                    title={person.character}
                  >
                    {person.character || "Cast"}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default memo(CastSection);