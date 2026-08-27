import React, {
    useEffect,
    useMemo,
    useState,
  } from "react";
  
  import {
    ChevronDown,
    Maximize,
    Minimize,
    X,
    ExternalLink,
  } from "lucide-react";
  
  import VideoPlayer from "./VideoPlayer";
  
  const getBestVideo = (videos = []) => {
    if (!Array.isArray(videos)) {
      return null;
    }
  
    const validVideos = videos.filter(
      (video) =>
        video?.key &&
        (
          video?.site === "YouTube" ||
          video?.site === "Vimeo"
        )
    );
  
    if (validVideos.length === 0) {
      return null;
    }
  
    const scoreVideo = (video) => {
      let score = 0;
  
      const name =
        video?.name?.toLowerCase() || "";
  
      const type =
        video?.type?.toLowerCase() || "";
  
      if (video?.official === true) {
        score += 100;
      }
  
      if (type === "trailer") {
        score += 100;
      }
  
      if (type === "teaser") {
        score += 80;
      }
  
      if (type === "clip") {
        score += 20;
      }
  
      if (name.includes("official")) {
        score += 30;
      }
  
      if (name.includes("trailer")) {
        score += 30;
      }
  
      if (video?.site === "YouTube") {
        score += 20;
      }
  
      return score;
    };
  
    return [...validVideos].sort(
      (a, b) =>
        scoreVideo(b) - scoreVideo(a)
    )[0];
  };
  
  const PlayerModal = ({
    isOpen,
    onClose,
    media,
    video,
    autoplay = true,
  }) => {
    const [isFullscreen, setIsFullscreen] =
      useState(false);
  
    const [showControls, setShowControls] =
      useState(true);
  
    const selectedVideo = useMemo(() => {
      if (video?.key) {
        return video;
      }
  
      return getBestVideo(
        media?.videos?.results || []
      );
    }, [video, media]);
  
    const title =
      media?.title ||
      media?.name ||
      "Video";
  
    useEffect(() => {
      if (!isOpen) {
        return;
      }
  
      const previousOverflow =
        document.body.style.overflow;
  
      document.body.style.overflow = "hidden";
  
      return () => {
        document.body.style.overflow =
          previousOverflow;
      };
    }, [isOpen]);
  
    useEffect(() => {
      if (!isOpen) {
        return;
      }
  
      const handleKeyDown = (event) => {
        if (event.key === "Escape") {
          onClose?.();
        }
      };
  
      window.addEventListener(
        "keydown",
        handleKeyDown
      );
  
      return () => {
        window.removeEventListener(
          "keydown",
          handleKeyDown
        );
      };
    }, [isOpen, onClose]);
  
    useEffect(() => {
      if (!isOpen) {
        setIsFullscreen(false);
        setShowControls(true);
      }
    }, [isOpen]);
  
    useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(
          Boolean(document.fullscreenElement)
        );
      };
  
      document.addEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
  
      return () => {
        document.removeEventListener(
          "fullscreenchange",
          handleFullscreenChange
        );
      };
    }, []);
  
    if (!isOpen) {
      return null;
    }
  
    const toggleFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
  
        } else {
          await document.exitFullscreen();
        }
      } catch (error) {
        console.error(
          "Fullscreen error:",
          error
        );
      }
    };
  
    const openOnYouTube = () => {
      if (
        selectedVideo?.site === "YouTube" &&
        selectedVideo?.key
      ) {
        window.open(
          `https://www.youtube.com/watch?v=${selectedVideo.key}`,
          "_blank",
          "noopener,noreferrer"
        );
      }
    };
  
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
        role="dialog"
        aria-modal="true"
        aria-label={`Playing ${title}`}
        onMouseMove={() =>
          setShowControls(true)
        }
      >
        {/* Background */}
        <div
          className="absolute inset-0 bg-black"
          onClick={onClose}
        />
  
        {/* Top controls */}
        <div
          className={`
            absolute
            left-0
            right-0
            top-0
            z-30
            flex
            items-center
            justify-between
            bg-gradient-to-b
            from-black
            via-black/80
            to-transparent
            px-4
            pb-12
            pt-5
            transition-opacity
            duration-300
            sm:px-7
            ${
              showControls
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }
          `}
        >
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Now playing
            </p>
  
            <h2 className="mt-1 truncate text-lg font-bold text-white sm:text-xl">
              {title}
            </h2>
          </div>
  
          <button
            type="button"
            aria-label="Close player"
            onClick={onClose}
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white/10
              text-white
              backdrop-blur
              transition
              hover:bg-white
              hover:text-black
            "
          >
            <X size={21} />
          </button>
        </div>
  
        {/* Player */}
        <div
          className="
            relative
            z-20
            w-full
            max-w-7xl
            overflow-hidden
            bg-black
            shadow-2xl
            lg:rounded-lg
          "
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <VideoPlayer
            video={selectedVideo}
            title={title}
            autoplay={autoplay}
          />
        </div>
  
        {/* Bottom controls */}
        <div
          className={`
            absolute
            bottom-0
            left-0
            right-0
            z-30
            flex
            items-center
            justify-between
            bg-gradient-to-t
            from-black
            via-black/80
            to-transparent
            px-4
            pb-5
            pt-12
            transition-opacity
            duration-300
            sm:px-7
            ${
              showControls
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }
          `}
        >
          <div className="text-xs text-zinc-400">
            {selectedVideo?.name ||
              selectedVideo?.type ||
              "Video"}
          </div>
  
          <div className="flex items-center gap-2">
            {/* YouTube fallback */}
            {selectedVideo?.site ===
              "YouTube" &&
              selectedVideo?.key && (
                <button
                  type="button"
                  onClick={openOnYouTube}
                  className="
                    flex
                    h-10
                    items-center
                    gap-2
                    rounded-full
                    bg-white/10
                    px-4
                    text-sm
                    font-medium
                    text-white
                    backdrop-blur
                    transition
                    hover:bg-white
                    hover:text-black
                  "
                >
                  <ExternalLink size={16} />
                  YouTube
                </button>
              )}
  
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={
                isFullscreen
                  ? "Exit fullscreen"
                  : "Enter fullscreen"
              }
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-white/10
                text-white
                backdrop-blur
                transition
                hover:bg-white
                hover:text-black
              "
            >
              {isFullscreen ? (
                <Minimize size={18} />
              ) : (
                <Maximize size={18} />
              )}
            </button>
  
            <button
              type="button"
              onClick={onClose}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-white/10
                text-white
                backdrop-blur
                transition
                hover:bg-white
                hover:text-black
              "
            >
              <ChevronDown size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default PlayerModal;