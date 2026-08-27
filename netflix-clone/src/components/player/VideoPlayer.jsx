import React, { useMemo } from "react";

const getYouTubeEmbedUrl = (key, autoplay = false) => {
  if (!key) return null;

  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    enablejsapi: "1",
  });

  if (autoplay) {
    params.set("autoplay", "1");
  }

  return `https://www.youtube.com/embed/${encodeURIComponent(
    key
  )}?${params.toString()}`;
};

const getVimeoUrl = (key, autoplay = false) => {
  if (!key) return null;

  const params = new URLSearchParams();

  if (autoplay) {
    params.set("autoplay", "1");
  }

  params.set("title", "0");
  params.set("byline", "0");
  params.set("portrait", "0");

  return `https://player.vimeo.com/video/${encodeURIComponent(
    key
  )}?${params.toString()}`;
};

const VideoPlayer = ({
  video,
  title = "Video",
  autoplay = false,
}) => {
  const embedUrl = useMemo(() => {
    if (!video?.key) {
      return null;
    }

    if (video.site === "YouTube") {
      return getYouTubeEmbedUrl(
        video.key,
        autoplay
      );
    }

    if (video.site === "Vimeo") {
      return getVimeoUrl(
        video.key,
        autoplay
      );
    }

    return null;
  }, [video, autoplay]);

  if (!video) {
    return (
      <div className="flex aspect-video w-full items-center justify-center bg-black text-center text-white">
        <div>
          <p className="text-lg font-semibold">
            Video not available
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            No trailer or video was found for this title.
          </p>
        </div>
      </div>
    );
  }

  if (!embedUrl) {
    return (
      <div className="flex aspect-video w-full items-center justify-center bg-black text-center text-white">
        <div>
          <p className="text-lg font-semibold">
            Unsupported video
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            {video.site || "Unknown"} videos are not supported.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full bg-black">
      <iframe
        key={`${video.site}-${video.key}`}
        src={embedUrl}
        title={title}
        className="absolute inset-0 h-full w-full border-0"
        allow="
          accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture;
          web-share;
          fullscreen
        "
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
};

export default VideoPlayer;