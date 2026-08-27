export function truncateText(
  text,
  limit = 150
) {
  if (!text || typeof text !== "string") {
    return "";
  }

  if (text.length <= limit) {
    return text;
  }

  return `${text.substring(0, limit).trim()}...`;
}

/* =========================================================
   MEDIA HELPERS
========================================================= */

export function getMovieTitle(movie) {
  if (!movie) {
    return "Unknown";
  }

  return (
    movie.title ||
    movie.name ||
    movie.original_title ||
    movie.original_name ||
    "Unknown"
  );
}

export function getMediaType(media) {
  if (!media) {
    return null;
  }

  if (media.media_type) {
    return media.media_type;
  }

  if (media.first_air_date || media.name) {
    return "tv";
  }

  if (media.release_date || media.title) {
    return "movie";
  }

  return null;
}

export function getReleaseDate(media) {
  if (!media) {
    return null;
  }

  return (
    media.release_date ||
    media.first_air_date ||
    null
  );
}

export function getYear(media) {
  const date = getReleaseDate(media);

  if (!date) {
    return "";
  }

  return date.substring(0, 4);
}

/* =========================================================
   IMAGE HELPERS
========================================================= */

export function getImageUrl(
  path,
  baseUrl = "https://image.tmdb.org/t/p/original"
) {
  if (!path) {
    return null;
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${baseUrl}${path}`;
}

/* =========================================================
   RATING HELPERS
========================================================= */

export function normalizeRating(
  rating,
  max = 10
) {
  const value = Number(rating);

  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(
    max,
    Math.max(0, value)
  );
}

export function formatRating(rating) {
  const value = normalizeRating(rating);

  if (!value) {
    return "N/A";
  }

  return value.toFixed(1);
}

/* =========================================================
   MOVIE HELPERS
========================================================= */

export function isMovie(media) {
  return getMediaType(media) === "movie";
}

export function isTV(media) {
  return getMediaType(media) === "tv";
}

export function getMovieId(movie) {
  return movie?.id ?? null;
}

export function getGenres(media, genreMap = {}) {
  if (!media) {
    return [];
  }

  if (
    Array.isArray(media.genres)
  ) {
    return media.genres;
  }

  if (
    Array.isArray(media.genre_ids)
  ) {
    return media.genre_ids
      .map((id) => genreMap[id])
      .filter(Boolean);
  }

  return [];
}

/* =========================================================
   ARRAY HELPERS
========================================================= */

export function removeDuplicates(
  items,
  key = "id"
) {
  if (!Array.isArray(items)) {
    return [];
  }

  const map = new Map();

  items.forEach((item) => {
    if (!item) return;

    const value =
      typeof key === "function"
        ? key(item)
        : item[key];

    if (value !== undefined && value !== null) {
      map.set(value, item);
    }
  });

  return Array.from(map.values());
}

export function shuffleArray(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return [...items].sort(
    () => Math.random() - 0.5
  );
}

/* =========================================================
   NAVIGATION
========================================================= */

export function scrollToTop(
  behavior = "smooth"
) {
  window.scrollTo({
    top: 0,
    behavior,
  });
}

/* =========================================================
   DEBOUNCE
========================================================= */

export function debounce(
  callback,
  delay = 300
) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

/* =========================================================
   SAFE JSON
========================================================= */

export function safeJsonParse(
  value,
  fallback = null
) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

/* =========================================================
   ERROR HELPERS
========================================================= */

export function getErrorMessage(error) {
  return (
    error?.userMessage ||
    error?.response?.data?.status_message ||
    error?.message ||
    "Something went wrong."
  );
}

/* =========================================================
   ASYNC HELPERS
========================================================= */

export function sleep(ms) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}