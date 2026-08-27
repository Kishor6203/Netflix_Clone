import React from "react";

const Skeleton = ({
  className = "",
  variant = "default",
}) => {
  const variants = {
    default:
      "rounded-md",

    text:
      "h-4 rounded",

    title:
      "h-7 rounded",

    circle:
      "rounded-full",

    poster:
      "aspect-[2/3] rounded-md",

    backdrop:
      "aspect-video rounded-md",

    avatar:
      "aspect-square rounded-full",
  };

  return (
    <div
      className={[
        "animate-pulse bg-zinc-800",
        variants[variant] ||
          variants.default,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    />
  );
};

export const MovieCardSkeleton = () => (
  <div className="w-full">
    <Skeleton variant="poster" />

    <div className="mt-3 space-y-2">
      <Skeleton
        variant="text"
        className="w-4/5"
      />

      <Skeleton
        variant="text"
        className="w-2/5"
      />
    </div>
  </div>
);

export const MovieRowSkeleton = ({
  count = 6,
}) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
    {Array.from({ length: count }).map(
      (_, index) => (
        <MovieCardSkeleton
          key={index}
        />
      )
    )}
  </div>
);

export const HeroSkeleton = () => (
  <div className="relative min-h-[60vh] w-full overflow-hidden bg-zinc-950 lg:min-h-[75vh]">
    <div className="absolute inset-0 bg-zinc-900" />

    <div className="relative z-10 flex min-h-[60vh] max-w-2xl flex-col justify-end px-6 pb-16 lg:min-h-[75vh] lg:px-12 lg:pb-24">
      <Skeleton
        className="mb-5 h-12 w-3/4"
      />

      <Skeleton
        className="mb-4 h-4 w-1/2"
      />

      <Skeleton
        className="mb-6 h-4 w-4/5"
      />

      <div className="flex gap-3">
        <Skeleton className="h-11 w-28" />
        <Skeleton className="h-11 w-32" />
      </div>
    </div>
  </div>
);

export default Skeleton;