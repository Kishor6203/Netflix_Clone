import React, { memo, useMemo, useState } from "react";
import { ExternalLink, Play } from "lucide-react";

const TrailerSection = ({ videos = [] }) => {
  const [playing, setPlaying] = useState(false);

  const trailer = useMemo(() => {
    if (!Array.isArray(videos)) {
      return null;
    }

    const youtubeVideos = videos.filter(
      (video) =>
        video?.site === "YouTube" &&
        video?.key
    );

    return (
      youtubeVideos.find(
        (video) =>
          video.type === "Trailer" &&
          video.official
      ) ||
      youtubeVideos.find(
        (video) =>
          video.type === "Trailer"
      ) ||
      youtubeVideos.find(
        (video) =>
          video.type === "Teaser"
      ) ||
      youtubeVideos[0] ||
      null
    );
  }, [videos]);

  if (!trailer) {
    return null;
  }

  const youtubeUrl = `https://www.youtube.com/watch?v=${trailer.key}`;

  const embedUrl =
    `https://www.youtube.com/embed/${trailer.key}` +
    `?rel=0&modestbranding=1`;

  return (
    <section className="bg-[#141414] px-4 py-12 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
              Watch
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Official Trailer
            </h2>
          </div>

          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition hover:text-white"
          >
            Open on YouTube

            <ExternalLink size={15} />
          </a>
        </div>

        <div className="mt-7 overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl">
          {!playing ? (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group relative block aspect-video w-full overflow-hidden"
            >
              {trailer.key ? (
                <img
                  src={`https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg`}
                  alt={`${trailer.name || "Trailer"} thumbnail`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full bg-zinc-900" />
              )}

              <div className="absolute inset-0 bg-black/40 transition group-hover:bg-black/25" />

              <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-xl transition group-hover:scale-110">
                <Play
                  size={24}
                  fill="currentColor"
                  className="ml-1"
                />
              </span>

              <span className="absolute bottom-5 left-5 max-w-[80%] truncate text-sm font-semibold text-white">
                {trailer.name || "Watch Trailer"}
              </span>
            </button>
          ) : (
            <div className="aspect-video w-full">
              <iframe
                title={trailer.name || "Movie trailer"}
                src={embedUrl}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default memo(TrailerSection);