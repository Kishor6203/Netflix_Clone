import { useEffect } from "react";
import { X, Play, Plus, Check, Star } from "lucide-react";

import { getMovieTitle } from "../../utils/helpers";
import { IMAGE_BASE_URL } from "../../utils/constants";
import useMyList from "../../hooks/useMyList";
import usePlayer from "../../hooks/usePlayer";

const MovieModal = ({ movie, open = false, onClose }) => {
  const { toggleMyList, isInMyList } = useMyList();
  const { openMedia } = usePlayer();

  useEffect(() => {
    if (!open) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !movie) return null;

  const title = getMovieTitle(movie);
  const inMyList = isInMyList(movie.id);
  const rating = Number(movie.vote_average || 0);
  const backdrop = movie.backdrop_path
    ? `${IMAGE_BASE_URL}${movie.backdrop_path}`
    : null;

  const handlePlay = () => {
    openMedia(movie, { autoplay: true });
    onClose?.();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} details`}
      onMouseDown={(e) =>
        e.target === e.currentTarget && onClose?.()
      }
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-[#181818] shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white hover:bg-white hover:text-black"
        >
          <X size={20} />
        </button>

        {backdrop && (
          <div className="relative aspect-video">
            <img
              src={backdrop}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
          </div>
        )}

        <div className="relative -mt-12 px-5 pb-8 sm:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            {title}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
            {movie.release_date && (
              <span>
                {new Date(movie.release_date).getFullYear()}
              </span>
            )}

            {rating > 0 && (
              <span className="flex items-center gap-1 text-yellow-400">
                <Star size={14} fill="currentColor" />
                {rating.toFixed(1)}
              </span>
            )}

            <span>HD</span>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={handlePlay}
              className="flex items-center gap-2 rounded bg-white px-5 py-2.5 text-sm font-bold text-black hover:bg-zinc-200"
            >
              <Play size={17} fill="currentColor" />
              Play
            </button>

            <button
              type="button"
              onClick={() => toggleMyList(movie)}
              className="flex items-center gap-2 rounded border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/20"
            >
              {inMyList ? <Check size={17} /> : <Plus size={17} />}
              {inMyList ? "In My List" : "My List"}
            </button>
          </div>

          <p className="mt-6 text-sm leading-7 text-zinc-300">
            {movie.overview || "No description available."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;