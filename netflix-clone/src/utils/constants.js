export const APP_NAME = "Netflix Clone";

export const APP_CONFIG = {
  name: APP_NAME,
  defaultLanguage: "en-US",
  defaultRegion: "IN",
  defaultPage: 1,
  posterWidth: "w500",
  backdropWidth: "w1280",
};

export const TMDB_IMAGE_BASE =
  "https://image.tmdb.org/t/p";

export const IMAGE_BASE_URL =
  `${TMDB_IMAGE_BASE}/original`;

export const POSTER_BASE_URL =
  `${TMDB_IMAGE_BASE}/w500`;

export const BACKDROP_BASE_URL =
  `${TMDB_IMAGE_BASE}/w1280`;

export const PROFILE_IMAGE_BASE_URL =
  `${TMDB_IMAGE_BASE}/w185`;

export const PLACEHOLDER_IMAGE =
  "https://placehold.co/500x750/141414/ffffff?text=No+Image";

export const PLACEHOLDER_BACKDROP =
  "https://placehold.co/1280x720/141414/ffffff?text=No+Backdrop";

/* =========================================================
   ROUTES
========================================================= */

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",

  MOVIES: "/movies",
  TV: "/tv",

  MOVIE_DETAILS: "/movie/:id",
  TV_DETAILS: "/tv/:id",

  SEARCH: "/search",
  MY_LIST: "/mylist",

  PROFILE: "/profile",
  ACCOUNT: "/account",

  NOT_FOUND: "*",
};

/* =========================================================
   STORAGE KEYS
========================================================= */

export const STORAGE_KEYS = {
  USER: "netflix_user",
  PROFILE: "netflix_active_profile",

  MY_LIST: "netflix_my_list",

  WATCH_HISTORY: "netflix_watch_history",

  CONTINUE_WATCHING: "netflix_continue_watching",

  SEARCH_HISTORY: "netflix_search_history",

  PREFERENCES: "netflix_preferences",

  THEME: "netflix_theme",
};

/* =========================================================
   MEDIA TYPES
========================================================= */

export const MEDIA_TYPES = {
  MOVIE: "movie",
  TV: "tv",
  PERSON: "person",
  ALL: "all",
};

/* =========================================================
   MOVIE CATEGORIES
========================================================= */

export const MOVIE_CATEGORIES = [
  {
    title: "Trending Now",
    key: "trending",
    endpoint: "getTrendingMovies",
  },
  {
    title: "Netflix Originals",
    key: "netflixOriginals",
    endpoint: "netflixOriginals",
  },
  {
    title: "Popular Movies",
    key: "popular",
    endpoint: "getPopularMovies",
  },
  {
    title: "Top Rated",
    key: "topRated",
    endpoint: "getTopRatedMovies",
  },
  {
    title: "Action Movies",
    key: "action",
    endpoint: "getActionMovies",
  },
  {
    title: "Comedy Movies",
    key: "comedy",
    endpoint: "getComedyMovies",
  },
  {
    title: "Horror Movies",
    key: "horror",
    endpoint: "getHorrorMovies",
  },
  {
    title: "Romance Movies",
    key: "romance",
    endpoint: "getRomanceMovies",
  },
  {
    title: "Documentaries",
    key: "documentaries",
    endpoint: "getDocumentaries",
  },
];

/* =========================================================
   TV CATEGORIES
========================================================= */

export const TV_CATEGORIES = [
  {
    title: "Trending TV",
    key: "trending",
  },
  {
    title: "Popular TV Shows",
    key: "popular",
  },
  {
    title: "Top Rated",
    key: "topRated",
  },
  {
    title: "Indian TV",
    key: "indian",
  },
  {
    title: "Drama",
    key: "drama",
  },
  {
    title: "Comedy",
    key: "comedy",
  },
  {
    title: "Crime",
    key: "crime",
  },
  {
    title: "Action",
    key: "action",
  },
];

/* =========================================================
   GENRES
========================================================= */

export const MOVIE_GENRES = {
  ACTION: 28,
  COMEDY: 35,
  HORROR: 27,
  ROMANCE: 10749,
  DOCUMENTARY: 99,
  THRILLER: 53,
  ANIMATION: 16,
  SCI_FI: 878,
};

export const TV_GENRES = {
  DRAMA: 18,
  COMEDY: 35,
  CRIME: 80,
  ACTION_ADVENTURE: 10759,
};

/* =========================================================
   PAGINATION
========================================================= */

export const PAGINATION = {
  FIRST_PAGE: 1,
  MAX_VISIBLE_PAGES: 5,
};

/* =========================================================
   LIMITS
========================================================= */

export const LIMITS = {
  SEARCH_HISTORY: 10,
  WATCH_HISTORY: 50,
  MY_LIST: 100,
  CONTINUE_WATCHING: 20,
};