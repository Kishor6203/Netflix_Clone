import React, { memo } from "react";
import {
  Play,
  Plus,
  Check,
  Share2,
} from "lucide-react";

const DetailsActions = ({
  movie,
  inMyList = false,
  onPlay,
  onMyList,
  onShare,
  showShare = true,
}) => {
  if (!movie) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => onPlay?.(movie)}
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
        onClick={() => onMyList?.(movie)}
        className="
          inline-flex
          items-center
          gap-2
          rounded-md
          bg-white/10
          px-6
          py-3
          text-sm
          font-bold
          text-white
          backdrop-blur
          transition
          hover:bg-white/20
        "
      >
        {inMyList ? (
          <Check size={18} />
        ) : (
          <Plus size={18} />
        )}

        {inMyList
          ? "Remove from My List"
          : "Add to My List"}
      </button>

      {showShare && (
        <button
          type="button"
          onClick={() => onShare?.(movie)}
          className="
            inline-flex
            items-center
            gap-2
            rounded-md
            border
            border-white/15
            bg-black/30
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-white/10
          "
        >
          <Share2 size={17} />

          Share
        </button>
      )}
    </div>
  );
};

export default memo(DetailsActions);