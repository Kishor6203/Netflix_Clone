import api from "./api";

export const INDIA = "IN";
export const US = "US";
export const DEFAULT_LANGUAGE = "en-US";
export const INDIAN_LANGUAGES = "hi|kn|ta|te|ml|bn|mr|gu|pa";

const EMPTY_RESPONSE = {
  page: 1,
  results: [],
  total_pages: 0,
  total_results: 0,
};

const emptyResponse = () => ({ ...EMPTY_RESPONSE });

const isValidId = (id) => id != null && String(id).trim() !== "";

const request = async (url, params = {}, config = {}) => {
  const { language = DEFAULT_LANGUAGE, ...rest } = params;

  const { data } = await api.get(url, {
    ...config,
    params: { language, ...rest },
  });

  return data;
};

const list = (type, endpoint, page = 1, params = {}, config = {}) =>
  request(`/${type}/${endpoint}`, { page, ...params }, config);

const discover = (type, params = {}, config = {}) =>
  request(`/discover/${type}`, {
    sort_by: "popularity.desc",
    include_adult: false,
    ...params,
  }, config);

const detail = (type, id, append, config = {}) => {
  if (!isValidId(id)) {
    return Promise.reject(
      new Error(`${type === "tv" ? "TV" : "Movie"} ID is required.`)
    );
  }

  return request(`/${type}/${id}`, {
    append_to_response: append,
  }, config);
};

const related = (type, id, endpoint, page = 1, config = {}) => {
  if (!isValidId(id)) {
    return Promise.reject(
      new Error(`${type === "tv" ? "TV" : "Movie"} ID is required.`)
    );
  }

  return request(`/${type}/${id}/${endpoint}`, { page }, config);
};

const search = (type, query, page = 1, params = {}, config = {}) => {
  const q = query?.trim();

  if (!q) return Promise.resolve(emptyResponse());

  return request(`/search/${type}`, {
    query: q,
    include_adult: false,
    page,
    ...params,
  }, config);
};

/* =========================================================
   DISCOVER
========================================================= */

export const discoverMovies = (params = {}, config = {}) =>
  discover("movie", params, config);

export const discoverTV = (params = {}, config = {}) =>
  discover("tv", params, config);

/* =========================================================
   TRENDING
========================================================= */

export const getTrending = (
  mediaType = "all",
  timeWindow = "week",
  config = {}
) => {
  const type = ["all", "movie", "tv"].includes(mediaType)
    ? mediaType
    : "all";

  const window = ["day", "week"].includes(timeWindow)
    ? timeWindow
    : "week";

  return request(`/trending/${type}/${window}`, {}, config);
};

export const getTrendingMovies = (config) =>
  getTrending("movie", "week", config);

export const getTrendingTV = (config) =>
  getTrending("tv", "week", config);

export const getTrendingAll = (config) =>
  getTrending("all", "week", config);

/* =========================================================
   MOVIE / TV LISTS
========================================================= */

const createListGetter = (type, endpoint, defaultParams = {}) =>
  (page = 1, config = {}) =>
    list(type, endpoint, page, defaultParams, config);

export const getPopularMovies =
  createListGetter("movie", "popular", { region: INDIA });

export const getTopRatedMovies =
  createListGetter("movie", "top_rated", { region: INDIA });

export const getNowPlayingMovies =
  createListGetter("movie", "now_playing", { region: INDIA });

export const getUpcomingMovies =
  createListGetter("movie", "upcoming", { region: INDIA });

export const getPopularTV =
  createListGetter("tv", "popular");

export const getTopRatedTV =
  createListGetter("tv", "top_rated");

export const getOnTheAirTV =
  createListGetter("tv", "on_the_air");

export const getAiringTodayTV =
  createListGetter("tv", "airing_today");

/* =========================================================
   GENRES
========================================================= */

const genre = (type, genreId, params = {}, config = {}) =>
  discover(type, {
    with_genres: genreId,
    ...params,
  }, config);

const movieGenre = (id) => (params = {}, config = {}) =>
  genre("movie", id, params, config);

const tvGenre = (id) => (params = {}, config = {}) =>
  genre("tv", id, params, config);

export const getActionMovies = movieGenre(28);
export const getComedyMovies = movieGenre(35);
export const getHorrorMovies = movieGenre(27);
export const getRomanceMovies = movieGenre(10749);
export const getDocumentaries = movieGenre(99);
export const getThrillerMovies = movieGenre(53);
export const getAnimationMovies = movieGenre(16);
export const getSciFiMovies = movieGenre(878);

export const getDramaTV = tvGenre(18);
export const getComedyTV = tvGenre(35);
export const getCrimeTV = tvGenre(80);
export const getActionTV = tvGenre(10759);

/* =========================================================
   INDIAN MOVIES
========================================================= */

export const getIndianMovies = (params = {}, config = {}) =>
  discoverMovies({
    with_origin_country: INDIA,
    region: INDIA,
    ...params,
  }, config);

export const getIndianMoviesByLanguage = (
  language,
  params = {},
  config = {}
) => {
  if (!language) return Promise.resolve(emptyResponse());

  return getIndianMovies({
    with_original_language: language,
    ...params,
  }, config);
};

const indianLanguage = (language) =>
  (params = {}, config = {}) =>
    getIndianMoviesByLanguage(language, params, config);

export const getIndianHindiMovies = indianLanguage("hi");
export const getIndianKannadaMovies = indianLanguage("kn");
export const getIndianTamilMovies = indianLanguage("ta");
export const getIndianTeluguMovies = indianLanguage("te");
export const getIndianMalayalamMovies = indianLanguage("ml");
export const getIndianBengaliMovies = indianLanguage("bn");
export const getIndianMarathiMovies = indianLanguage("mr");
export const getIndianGujaratiMovies = indianLanguage("gu");

/* =========================================================
   INDIAN MOVIE SORTS
========================================================= */

export const getIndianPopularMovies = (page = 1, config = {}) =>
  getIndianMovies({
    page,
    sort_by: "popularity.desc",
  }, config);

export const getIndianTopRatedMovies = (page = 1, config = {}) =>
  getIndianMovies({
    page,
    sort_by: "vote_average.desc",
    "vote_count.gte": 100,
  }, config);

export const getIndianLatestMovies = (page = 1, config = {}) =>
  getIndianMovies({
    page,
    sort_by: "primary_release_date.desc",
  }, config);

export const getIndianTrendingMovies = (config = {}) =>
  request("/trending/movie/week", { region: INDIA }, config);

/* =========================================================
   INDIAN MOVIE GENRES
========================================================= */

const indianGenre = (id) => (params = {}, config = {}) =>
  getIndianMovies({
    with_genres: id,
    ...params,
  }, config);

export const getIndianActionMovies = indianGenre(28);
export const getIndianComedyMovies = indianGenre(35);
export const getIndianRomanceMovies = indianGenre(10749);
export const getIndianThrillerMovies = indianGenre(53);
export const getIndianHorrorMovies = indianGenre(27);
export const getIndianAnimationMovies = indianGenre(16);
export const getIndianDocumentaries = indianGenre(99);

/* =========================================================
   INDIAN TV
========================================================= */

export const getIndianTV = (params = {}, config = {}) =>
  discoverTV({
    with_origin_country: INDIA,
    ...params,
  }, config);

export const getIndianPopularTV = (page = 1, config = {}) =>
  getIndianTV({
    page,
    sort_by: "popularity.desc",
  }, config);

export const getIndianTopRatedTV = (page = 1, config = {}) =>
  getIndianTV({
    page,
    sort_by: "vote_average.desc",
    "vote_count.gte": 50,
  }, config);

export const getIndianTrendingTV = (config = {}) =>
  request("/trending/tv/week", {}, config);

export const getIndianDramaTV = tvGenre(18);
export const getIndianComedyTV = tvGenre(35);
export const getIndianCrimeTV = tvGenre(80);
export const getIndianActionTV = tvGenre(10759);

/* =========================================================
   INTERNATIONAL TV
========================================================= */

export const getInternationalPopularTV = (page = 1, config = {}) =>
  discoverTV({
    page,
    sort_by: "popularity.desc",
  }, config);

export const getInternationalTopRatedTV = (page = 1, config = {}) =>
  discoverTV({
    page,
    sort_by: "vote_average.desc",
    "vote_count.gte": 100,
  }, config);

/* =========================================================
   DETAILS
========================================================= */

export const getMovieDetails = (id, config = {}) =>
  detail(
    "movie",
    id,
    "videos,credits,similar,recommendations,release_dates",
    config
  );

export const getTVDetails = (id, config = {}) =>
  detail(
    "tv",
    id,
    "videos,credits,similar,recommendations,content_ratings",
    config
  );

export const getMediaDetails = (
  id,
  mediaType = "movie",
  config = {}
) =>
  mediaType === "tv"
    ? getTVDetails(id, config)
    : getMovieDetails(id, config);

/* =========================================================
   VIDEOS
========================================================= */

const getVideos = (type, id, config = {}) => {
  if (!isValidId(id)) {
    return Promise.reject(
      new Error(`${type === "tv" ? "TV" : "Movie"} ID is required.`)
    );
  }

  return request(`/${type}/${id}/videos`, {
    include_video_language: "en-US,en,null",
  }, config);
};

export const getMovieVideos = (id, config = {}) =>
  getVideos("movie", id, config);

export const getTVVideos = (id, config = {}) =>
  getVideos("tv", id, config);

/* =========================================================
   VIDEO HELPERS
========================================================= */

const VIDEO_PRIORITY = [
  "Trailer",
  "Teaser",
  "Clip",
  "Featurette",
  "Opening Credits",
];

const isYouTube = (video) =>
  video?.site?.toLowerCase() === "youtube";

const isPlayableYouTube = (video) =>
  isYouTube(video) && Boolean(video?.key);

const getVideoScore = (video) => {
  if (!isPlayableYouTube(video)) return -1;

  const typeIndex = VIDEO_PRIORITY.indexOf(video.type);

  return (
    (typeIndex === -1 ? 0 : VIDEO_PRIORITY.length - typeIndex) * 100 +
    (video.official ? 50 : 0) +
    (["en", "en-US"].includes(video.iso_639_1) ? 20 : 0)
  );
};

export const pickBestVideo = (videos = []) =>
  Array.isArray(videos)
    ? videos
        .filter(isPlayableYouTube)
        .sort((a, b) => getVideoScore(b) - getVideoScore(a))[0] || null
    : null;

export const getBestMovieVideo = async (id, config = {}) =>
  pickBestVideo((await getMovieVideos(id, config))?.results);

export const getBestTVVideo = async (id, config = {}) =>
  pickBestVideo((await getTVVideos(id, config))?.results);

export const getBestVideo = async (
  id,
  mediaType = "movie",
  config = {}
) =>
  pickBestVideo(
    (
      await (mediaType === "tv"
        ? getTVVideos(id, config)
        : getMovieVideos(id, config))
    )?.results
  );

/* =========================================================
   YOUTUBE
========================================================= */

const getVideoKey = (videoOrKey) =>
  typeof videoOrKey === "string"
    ? videoOrKey
    : videoOrKey?.key;

export const getYouTubeWatchUrl = (videoOrKey) => {
  const key = getVideoKey(videoOrKey);
  return key
    ? `https://www.youtube.com/watch?v=${encodeURIComponent(key)}`
    : null;
};

export const getYouTubeEmbedUrl = (videoOrKey, params = {}) => {
  const key = getVideoKey(videoOrKey);
  if (!key) return null;

  const searchParams = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    ...params,
  });

  return `https://www.youtube.com/embed/${encodeURIComponent(
    key
  )}?${searchParams}`;
};

const bestTrailer = async (type, id, config = {}) => {
  const video =
    type === "tv"
      ? await getBestTVVideo(id, config)
      : await getBestMovieVideo(id, config);

  if (!video) return null;

  return {
    ...video,
    watchUrl: getYouTubeWatchUrl(video),
    embedUrl: getYouTubeEmbedUrl(video),
  };
};

export const getBestTrailer = (id, config = {}) =>
  bestTrailer("movie", id, config);

export const getBestTVTrailer = (id, config = {}) =>
  bestTrailer("tv", id, config);

/* =========================================================
   CREDITS
========================================================= */

export const getMovieCredits = (id, config = {}) =>
  requestId("movie", id, "credits", config);

export const getTVCredits = (id, config = {}) =>
  requestId("tv", id, "credits", config);

const requestId = (type, id, endpoint, config = {}) => {
  if (!isValidId(id)) {
    return Promise.reject(
      new Error(`${type === "tv" ? "TV" : "Movie"} ID is required.`)
    );
  }

  return request(`/${type}/${id}/${endpoint}`, {}, config);
};

/* =========================================================
   SIMILAR / RECOMMENDATIONS
========================================================= */

export const getSimilarMovies = (id, page = 1, config = {}) =>
  related("movie", id, "similar", page, config);

export const getMovieRecommendations = (id, page = 1, config = {}) =>
  related("movie", id, "recommendations", page, config);

export const getSimilarTV = (id, page = 1, config = {}) =>
  related("tv", id, "similar", page, config);

export const getTVRecommendations = (id, page = 1, config = {}) =>
  related("tv", id, "recommendations", page, config);

/* =========================================================
   SEARCH
========================================================= */

export const searchMovies = (query, page = 1, config = {}) =>
  search("movie", query, page, { region: INDIA }, config);

export const searchTV = (query, page = 1, config = {}) =>
  search("tv", query, page, {}, config);

export const searchMulti = (query, page = 1, config = {}) =>
  search("multi", query, page, { region: INDIA }, config);

export const searchPeople = (query, page = 1, config = {}) =>
  search("person", query, page, {}, config);

/* =========================================================
   PEOPLE / GENRES / CONFIG
========================================================= */

export const getPersonDetails = (id, config = {}) => {
  if (!isValidId(id)) {
    return Promise.reject(new Error("Person ID is required."));
  }

  return request(`/person/${id}`, {
    append_to_response: "combined_credits,images",
  }, config);
};

export const getMovieGenres = (config = {}) =>
  request("/genre/movie/list", {}, config);

export const getTVGenres = (config = {}) =>
  request("/genre/tv/list", {}, config);

export const getTMDBConfiguration = (config = {}) =>
  request("/configuration", {}, config);

/* =========================================================
   LEGACY API
========================================================= */

export const requests = {
  trending: (config) => getTrendingAll(config),
  popular: (page, config) => getPopularMovies(page, config),
  topRated: (page, config) => getTopRatedMovies(page, config),
  nowPlaying: (page, config) => getNowPlayingMovies(page, config),
  upcoming: (page, config) => getUpcomingMovies(page, config),

  netflixOriginals: (page = 1, config = {}) =>
    discoverTV({
      page,
      with_networks: 213,
      with_origin_country: US,
    }, config),

  action: getActionMovies,
  comedy: getComedyMovies,
  horror: getHorrorMovies,
  romance: getRomanceMovies,
  documentaries: getDocumentaries,
  thriller: getThrillerMovies,
  animation: getAnimationMovies,
  sciFi: getSciFiMovies,

  indianMovies: getIndianMovies,
  indianPopular: getIndianPopularMovies,
  indianTopRated: getIndianTopRatedMovies,
  indianLatest: getIndianLatestMovies,
  indianTrending: getIndianTrendingMovies,

  indianHindi: getIndianHindiMovies,
  indianKannada: getIndianKannadaMovies,
  indianTamil: getIndianTamilMovies,
  indianTelugu: getIndianTeluguMovies,
  indianMalayalam: getIndianMalayalamMovies,
  indianBengali: getIndianBengaliMovies,
  indianMarathi: getIndianMarathiMovies,
  indianGujarati: getIndianGujaratiMovies,

  indianAction: getIndianActionMovies,
  indianComedy: getIndianComedyMovies,
  indianRomance: getIndianRomanceMovies,
  indianThriller: getIndianThrillerMovies,
  indianHorror: getIndianHorrorMovies,
  indianAnimation: getIndianAnimationMovies,
  indianDocumentaries: getIndianDocumentaries,

  indianTV: getIndianTV,
  indianTVPopular: getIndianPopularTV,
  indianTVTopRated: getIndianTopRatedTV,
  indianTVTrending: getIndianTrendingTV,
  indianDramaTV: getIndianDramaTV,
  indianComedyTV: getIndianComedyTV,
  indianCrimeTV: getIndianCrimeTV,
  indianActionTV: getIndianActionTV,

  popularTV: getInternationalPopularTV,
  topRatedTV: getInternationalTopRatedTV,
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const tmdbService = {
  discoverMovies,
  discoverTV,

  getTrending,
  getTrendingMovies,
  getTrendingTV,
  getTrendingAll,

  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,

  getPopularTV,
  getTopRatedTV,
  getOnTheAirTV,
  getAiringTodayTV,

  getActionMovies,
  getComedyMovies,
  getHorrorMovies,
  getRomanceMovies,
  getDocumentaries,
  getThrillerMovies,
  getAnimationMovies,
  getSciFiMovies,

  getDramaTV,
  getComedyTV,
  getCrimeTV,
  getActionTV,

  getIndianMovies,
  getIndianMoviesByLanguage,
  getIndianHindiMovies,
  getIndianKannadaMovies,
  getIndianTamilMovies,
  getIndianTeluguMovies,
  getIndianMalayalamMovies,
  getIndianBengaliMovies,
  getIndianMarathiMovies,
  getIndianGujaratiMovies,

  getIndianPopularMovies,
  getIndianTopRatedMovies,
  getIndianLatestMovies,
  getIndianTrendingMovies,

  getIndianActionMovies,
  getIndianComedyMovies,
  getIndianRomanceMovies,
  getIndianThrillerMovies,
  getIndianHorrorMovies,
  getIndianAnimationMovies,
  getIndianDocumentaries,

  getIndianTV,
  getIndianPopularTV,
  getIndianTopRatedTV,
  getIndianTrendingTV,
  getIndianDramaTV,
  getIndianComedyTV,
  getIndianCrimeTV,
  getIndianActionTV,

  getInternationalPopularTV,
  getInternationalTopRatedTV,

  getMediaDetails,
  getMovieDetails,
  getTVDetails,

  getMovieVideos,
  getTVVideos,
  getBestVideo,
  getBestMovieVideo,
  getBestTVVideo,
  getBestTrailer,
  getBestTVTrailer,
  pickBestVideo,

  getYouTubeWatchUrl,
  getYouTubeEmbedUrl,

  getMovieCredits,
  getTVCredits,

  getSimilarMovies,
  getMovieRecommendations,
  getSimilarTV,
  getTVRecommendations,

  searchMovies,
  searchTV,
  searchMulti,
  searchPeople,

  getPersonDetails,
  getMovieGenres,
  getTVGenres,
  getTMDBConfiguration,

  requests,
};

export default tmdbService;