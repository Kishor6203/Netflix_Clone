import {
    useMemo,
  } from "react";
  
  import usePlayer from "./usePlayer";
  
  const useWatchHistory = () => {
    const {
      watchHistory,
      continueWatching,
      addToHistory,
      removeFromHistory,
      clearHistory,
      saveProgress,
    } = usePlayer();
  
    const recentlyWatched =
      useMemo(
        () =>
          [...watchHistory].sort(
            (a, b) =>
              new Date(
                b.watchedAt
              ) -
              new Date(
                a.watchedAt
              )
          ),
        [watchHistory]
      );
  
    return {
      history: watchHistory,
      recentlyWatched,
  
      continueWatching,
  
      addToHistory,
      removeFromHistory,
      clearHistory,
  
      saveProgress,
    };
  };
  
  export default useWatchHistory;