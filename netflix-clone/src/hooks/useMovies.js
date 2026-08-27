import { useCallback, useMemo, useState } from "react";

import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getActionMovies,
  getComedyMovies,
  getHorrorMovies,
  getRomanceMovies,
  getDocumentaries,
  getThrillerMovies,
  getAnimationMovies,
  getSciFiMovies,
  getIndianMovies,
  getIndianPopularMovies,
  getIndianTopRatedMovies,
  getIndianTrendingMovies,
  getIndianActionMovies,
  getIndianComedyMovies,
  getIndianRomanceMovies,
  getIndianThrillerMovies,
  getIndianHorrorMovies,
  getIndianAnimationMovies,
  getMovieDetails,
  getMovieCredits,
  getSimilarMovies,
  getMovieRecommendations,
  getMovieVideos,
  searchMulti,
  getPopularTV,
  getTopRatedTV,
  getIndianTV,
  getIndianPopularTV,
  getIndianTopRatedTV,
  getIndianTrendingTV,
  getIndianDramaTV,
  getIndianComedyTV,
  getIndianCrimeTV,
  getIndianActionTV,
} from "../services/tmdb";

const ENDPOINTS = {
  trending: getTrendingMovies,
  popular: getPopularMovies,
  topRated: getTopRatedMovies,
  nowPlaying: getNowPlayingMovies,
  upcoming: getUpcomingMovies,

  action: getActionMovies,
  comedy: getComedyMovies,
  horror: getHorrorMovies,
  romance: getRomanceMovies,
  documentaries: getDocumentaries,
  thriller: getThrillerMovies,
  animation: getAnimationMovies,
  sciFi: getSciFiMovies,

  indian: getIndianMovies,
  indianPopular: getIndianPopularMovies,
  indianTopRated: getIndianTopRatedMovies,
  indianTrending: getIndianTrendingMovies,
  indianAction: getIndianActionMovies,
  indianComedy: getIndianComedyMovies,
  indianRomance: getIndianRomanceMovies,
  indianThriller: getIndianThrillerMovies,
  indianHorror: getIndianHorrorMovies,
  indianAnimation: getIndianAnimationMovies,

  popularTV: getPopularTV,
  topRatedTV: getTopRatedTV,
  indianTV: getIndianTV,
  indianTVPopular: getIndianPopularTV,
  indianTVTopRated: getIndianTopRatedTV,
  indianTVTrending: getIndianTrendingTV,
  indianDramaTV: getIndianDramaTV,
  indianComedyTV: getIndianComedyTV,
  indianCrimeTV: getIndianCrimeTV,
  indianActionTV: getIndianActionTV,
};

const useMovies = () => {
  const [categoryData, setCategoryData] = useState({});
  const [categoryLoading, setCategoryLoading] = useState({});
  const [categoryErrors, setCategoryErrors] = useState({});

  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchMeta, setSearchMeta] = useState({
    page: 1,
    totalPages: 0,
    totalResults: 0,
  });

  const loadCategory = useCallback(async (key, page = 1, options = {}) => {
    const fetcher = ENDPOINTS[key];

    if (!fetcher) {
      throw new Error(`Unknown movie category: ${key}`);
    }

    setCategoryLoading((prev) => ({ ...prev, [key]: true }));
    setCategoryErrors((prev) => ({ ...prev, [key]: null }));

    try {
      const result = await fetcher(page, options);
      setCategoryData((prev) => ({ ...prev, [key]: result }));
      return result;
    } catch (error) {
      setCategoryErrors((prev) => ({ ...prev, [key]: error }));
      throw error;
    } finally {
      setCategoryLoading((prev) => ({ ...prev, [key]: false }));
    }
  }, []);

  const loadDetails = useCallback(async (id) => {
    if (!id) throw new Error("Movie ID is required.");

    setDetailsLoading(true);
    setDetailsError(null);

    try {
      const result = await getMovieDetails(id);
      setDetails(result);
      return result;
    } catch (error) {
      setDetailsError(error);
      throw error;
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  const loadMovieCredits = useCallback((id) => getMovieCredits(id), []);
  const loadMovieVideos = useCallback((id) => getMovieVideos(id), []);

  const loadSimilarMovies = useCallback(
    (id, page = 1) => getSimilarMovies(id, page),
    []
  );

  const loadRecommendations = useCallback(
    (id, page = 1) => getMovieRecommendations(id, page),
    []
  );

  const search = useCallback(async (query, page = 1) => {
    const cleanQuery = query?.trim();

    if (!cleanQuery) {
      setSearchResults([]);
      setSearchMeta({
        page: 1,
        totalPages: 0,
        totalResults: 0,
      });
      return null;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      const result = await searchMulti(cleanQuery, page);

      const filtered = (result.results || []).filter(
        (item) => item.media_type === "movie" || item.media_type === "tv"
      );

      setSearchResults(filtered);
      setSearchMeta({
        page: result.page || page,
        totalPages: result.total_pages || 0,
        totalResults: result.total_results || 0,
      });

      return { ...result, results: filtered };
    } catch (error) {
      setSearchError(error);
      throw error;
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const resetSearch = useCallback(() => {
    setSearchResults([]);
    setSearchError(null);
    setSearchMeta({
      page: 1,
      totalPages: 0,
      totalResults: 0,
    });
  }, []);

  const clearDetails = useCallback(() => {
    setDetails(null);
    setDetailsError(null);
  }, []);

  const getCategory = useCallback(
    (key) => categoryData[key]?.results || [],
    [categoryData]
  );

  const hasCategory = useCallback(
    (key) => Boolean(categoryData[key]),
    [categoryData]
  );

  return useMemo(
    () => ({
      categoryData,
      categoryLoading,
      categoryErrors,
      loadCategory,
      getCategory,
      hasCategory,

      details,
      detailsLoading,
      detailsError,
      loadDetails,
      clearDetails,
      loadMovieCredits,
      loadMovieVideos,
      loadSimilarMovies,
      loadRecommendations,

      searchResults,
      searchLoading,
      searchError,
      searchMeta,
      search,
      resetSearch,
    }),
    [
      categoryData,
      categoryLoading,
      categoryErrors,
      loadCategory,
      getCategory,
      hasCategory,
      details,
      detailsLoading,
      detailsError,
      loadDetails,
      clearDetails,
      loadMovieCredits,
      loadMovieVideos,
      loadSimilarMovies,
      loadRecommendations,
      searchResults,
      searchLoading,
      searchError,
      searchMeta,
      search,
      resetSearch,
    ]
  );
};

export default useMovies;