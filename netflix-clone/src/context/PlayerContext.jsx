import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import useAuth from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";

import {
  getStorage,
  saveStorage,
} from "../utils/storage";

const PlayerContext = createContext(null);

/* =========================================================
   STORAGE KEYS
========================================================= */

const getPlayerKey = (uid, profileId) =>
  `netflix_player_${uid}_${profileId}`;

const getHistoryKey = (uid, profileId) =>
  `netflix_watch_history_${uid}_${profileId}`;

const getContinueKey = (uid, profileId) =>
  `netflix_continue_watching_${uid}_${profileId}`;

/* =========================================================
   PROVIDER
========================================================= */

export const PlayerProvider = ({ children }) => {
  const { user } = useAuth();
  const { activeProfile } = useProfile();

  /* =======================================================
     PLAYER STATE
  ======================================================= */

  const [currentMedia, setCurrentMedia] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(1);

  const [muted, setMuted] = useState(false);

  const [playbackRate, setPlaybackRate] = useState(1);

  const [fullscreen, setFullscreen] = useState(false);

  const [showSubtitles, setShowSubtitles] = useState(false);

  const [continueWatching, setContinueWatching] =
    useState([]);

  const [watchHistory, setWatchHistory] = useState([]);

  /* =======================================================
     PROFILE IDENTIFIER
  ======================================================= */

  const uid = user?.uid;
  const profileId = activeProfile?.id;

  /* =======================================================
     LOAD PROFILE DATA
  ======================================================= */

  useEffect(() => {
    if (!uid || !profileId) {
      setContinueWatching([]);
      setWatchHistory([]);

      return;
    }

    const continueData = getStorage(
      getContinueKey(uid, profileId),
      []
    );

    const historyData = getStorage(
      getHistoryKey(uid, profileId),
      []
    );

    const playerSettings = getStorage(
      getPlayerKey(uid, profileId),
      null
    );

    setContinueWatching(
      Array.isArray(continueData)
        ? continueData
        : []
    );

    setWatchHistory(
      Array.isArray(historyData)
        ? historyData
        : []
    );

    if (playerSettings) {
      setVolume(
        typeof playerSettings.volume === "number"
          ? playerSettings.volume
          : 1
      );

      setMuted(Boolean(playerSettings.muted));

      setPlaybackRate(
        typeof playerSettings.playbackRate === "number"
          ? playerSettings.playbackRate
          : 1
      );

      setShowSubtitles(
        Boolean(playerSettings.showSubtitles)
      );
    } else {
      setVolume(1);
      setMuted(false);
      setPlaybackRate(1);
      setShowSubtitles(false);
    }
  }, [uid, profileId]);

  /* =======================================================
     SAVE PLAYER SETTINGS
  ======================================================= */

  useEffect(() => {
    if (!uid || !profileId) {
      return;
    }

    saveStorage(
      getPlayerKey(uid, profileId),
      {
        volume,
        muted,
        playbackRate,
        showSubtitles,
      }
    );
  }, [
    uid,
    profileId,
    volume,
    muted,
    playbackRate,
    showSubtitles,
  ]);

  /* =======================================================
     ADD HISTORY
  ======================================================= */

  const addToHistory = useCallback(
    (media) => {
      if (!uid || !profileId || !media?.id) {
        return;
      }

      setWatchHistory((current) => {
        const item = {
          ...media,
          watchedAt: new Date().toISOString(),
        };

        const next = [
          item,
          ...current.filter(
            (existing) =>
              existing.id !== media.id
          ),
        ].slice(0, 50);

        saveStorage(
          getHistoryKey(uid, profileId),
          next
        );

        return next;
      });
    },
    [uid, profileId]
  );

  /* =======================================================
     OPEN MEDIA
  ======================================================= */

  const openMedia = useCallback(
    (media, options = {}) => {
      if (!media?.id) {
        console.warn(
          "Player: media ID is missing."
        );

        return;
      }

      const existing =
        continueWatching.find(
          (item) =>
            String(item.id) === String(media.id)
        );

      const startTime =
        options.startTime ??
        existing?.progress ??
        0;

      const mediaDuration =
        options.duration ??
        existing?.duration ??
        0;

      setCurrentMedia(media);

      setCurrentTime(
        Math.max(0, Number(startTime) || 0)
      );

      setDuration(
        Math.max(
          0,
          Number(mediaDuration) || 0
        )
      );

      setIsPlaying(
        options.autoplay !== false
      );
    },
    [continueWatching]
  );

  /* =======================================================
     CLOSE PLAYER
  ======================================================= */

  const closePlayer = useCallback(() => {
    setIsPlaying(false);
    setCurrentMedia(null);
    setCurrentTime(0);
    setDuration(0);
    setFullscreen(false);
  }, []);

  /* =======================================================
     PLAYBACK
  ======================================================= */

  const play = useCallback(() => {
    if (!currentMedia) {
      return;
    }

    setIsPlaying(true);
  }, [currentMedia]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (!currentMedia) {
      return;
    }

    setIsPlaying((value) => !value);
  }, [currentMedia]);

  /* =======================================================
     TIME
  ======================================================= */

  const updateTime = useCallback((time) => {
    const value = Math.max(
      0,
      Number(time) || 0
    );

    setCurrentTime(value);
  }, []);

  const updateDuration = useCallback((value) => {
    const next = Math.max(
      0,
      Number(value) || 0
    );

    setDuration(next);
  }, []);

  const seek = useCallback(
    (time) => {
      const nextTime = Math.max(
        0,
        Number(time) || 0
      );

      if (duration > 0) {
        setCurrentTime(
          Math.min(nextTime, duration)
        );
      } else {
        setCurrentTime(nextTime);
      }
    },
    [duration]
  );

  const seekForward = useCallback(
    (seconds = 10) => {
      seek(
        currentTime +
          Number(seconds || 10)
      );
    },
    [currentTime, seek]
  );

  const seekBackward = useCallback(
    (seconds = 10) => {
      seek(
        currentTime -
          Number(seconds || 10)
      );
    },
    [currentTime, seek]
  );

  /* =======================================================
     VOLUME
  ======================================================= */

  const changeVolume = useCallback(
    (value) => {
      const next = Math.min(
        1,
        Math.max(
          0,
          Number(value) || 0
        )
      );

      setVolume(next);

      if (next > 0) {
        setMuted(false);
      } else {
        setMuted(true);
      }
    },
    []
  );

  const toggleMute = useCallback(() => {
    setMuted((value) => !value);
  }, []);

  /* =======================================================
     PLAYBACK SPEED
  ======================================================= */

  const changePlaybackRate =
    useCallback((rate) => {
      const allowed = [
        0.5,
        0.75,
        1,
        1.25,
        1.5,
        1.75,
        2,
      ];

      const numericRate = Number(rate);

      if (!allowed.includes(numericRate)) {
        return;
      }

      setPlaybackRate(numericRate);
    }, []);

  /* =======================================================
     FULLSCREEN
  ======================================================= */

  const toggleFullscreen =
    useCallback(() => {
      setFullscreen((value) => !value);
    }, []);

  /* =======================================================
     SUBTITLES
  ======================================================= */

  const toggleSubtitles =
    useCallback(() => {
      setShowSubtitles((value) => !value);
    }, []);

  /* =======================================================
     SAVE PROGRESS
  ======================================================= */

  const saveProgress = useCallback(
    (media, progress, mediaDuration) => {
      if (!uid || !profileId || !media?.id) {
        return;
      }

      const progressValue = Math.max(
        0,
        Number(progress) || 0
      );

      const durationValue = Math.max(
        0,
        Number(mediaDuration) || 0
      );

      if (progressValue < 5) {
        return;
      }

      const percentage =
        durationValue > 0
          ? progressValue / durationValue
          : 0;

      /* Completed */

      if (percentage >= 0.95) {
        setContinueWatching((current) => {
          const next = current.filter(
            (item) =>
              String(item.id) !==
              String(media.id)
          );

          saveStorage(
            getContinueKey(uid, profileId),
            next
          );

          return next;
        });

        addToHistory(media);

        return;
      }

      /* Continue watching */

      const item = {
        ...media,
        progress: progressValue,
        duration: durationValue,
        progressPercentage: Math.round(
          percentage * 100
        ),
        watchedAt: new Date().toISOString(),
      };

      setContinueWatching((current) => {
        const next = [
          item,
          ...current.filter(
            (existing) =>
              String(existing.id) !==
              String(media.id)
          ),
        ].slice(0, 20);

        saveStorage(
          getContinueKey(
            uid,
            profileId
          ),
          next
        );

        return next;
      });
    },
    [
      uid,
      profileId,
      addToHistory,
    ]
  );

  /* =======================================================
     REMOVE HISTORY
  ======================================================= */

  const removeFromHistory =
    useCallback(
      (mediaId) => {
        setWatchHistory((current) => {
          const next = current.filter(
            (item) =>
              String(item.id) !==
              String(mediaId)
          );

          if (uid && profileId) {
            saveStorage(
              getHistoryKey(
                uid,
                profileId
              ),
              next
            );
          }

          return next;
        });
      },
      [uid, profileId]
    );

  /* =======================================================
     CLEAR HISTORY
  ======================================================= */

  const clearHistory = useCallback(() => {
    setWatchHistory([]);

    if (uid && profileId) {
      saveStorage(
        getHistoryKey(
          uid,
          profileId
        ),
        []
      );
    }
  }, [uid, profileId]);

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = useMemo(
    () => ({
      currentMedia,
      isPlaying,

      currentTime,
      duration,

      volume,
      muted,

      playbackRate,
      fullscreen,
      showSubtitles,

      continueWatching,
      watchHistory,

      openMedia,
      closePlayer,

      play,
      pause,
      togglePlay,

      updateTime,
      updateDuration,

      seek,
      seekForward,
      seekBackward,

      changeVolume,
      toggleMute,

      changePlaybackRate,

      toggleFullscreen,
      toggleSubtitles,

      saveProgress,

      addToHistory,
      removeFromHistory,
      clearHistory,
    }),
    [
      currentMedia,
      isPlaying,

      currentTime,
      duration,

      volume,
      muted,

      playbackRate,
      fullscreen,
      showSubtitles,

      continueWatching,
      watchHistory,

      openMedia,
      closePlayer,

      play,
      pause,
      togglePlay,

      updateTime,
      updateDuration,

      seek,
      seekForward,
      seekBackward,

      changeVolume,
      toggleMute,

      changePlaybackRate,

      toggleFullscreen,
      toggleSubtitles,

      saveProgress,

      addToHistory,
      removeFromHistory,
      clearHistory,
    ]
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContext;