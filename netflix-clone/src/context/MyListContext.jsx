import React, {
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

const MyListContext = createContext(null);

/* =========================================================
   STORAGE KEY
========================================================= */

const getMyListKey = (uid, profileId) => {
  return `netflix_my_list_${uid}_${profileId}`;
};

/* =========================================================
   MEDIA TYPE
========================================================= */

const getMediaType = (item) => {
  if (item?.media_type === "tv") {
    return "tv";
  }

  if (item?.media_type === "movie") {
    return "movie";
  }

  if (item?.first_air_date) {
    return "tv";
  }

  return "movie";
};

/* =========================================================
   UNIQUE ITEM KEY
   Prevents movie ID 123 and TV ID 123
   from being treated as the same item.
========================================================= */

const getItemKey = (item) => {
  if (!item?.id) {
    return null;
  }

  return `${getMediaType(item)}-${item.id}`;
};

/* =========================================================
   PROVIDER
========================================================= */

export const MyListProvider = ({ children }) => {
  const { user } = useAuth();

  const {
    activeProfile,
    loading: profileLoading,
  } = useProfile();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =======================================================
     LOAD LIST
  ======================================================= */

  useEffect(() => {
    /*
     * No authenticated user/profile yet.
     */
    if (!user?.uid || !activeProfile?.id) {
      setItems([]);

      setLoading(
        Boolean(profileLoading)
      );

      return;
    }

    const key = getMyListKey(
      user.uid,
      activeProfile.id
    );

    const stored = getStorage(
      key,
      []
    );

    /*
     * Make sure stored data is always an array.
     */
    const storedItems = Array.isArray(stored)
      ? stored
      : [];

    /*
     * Normalize old saved items so every
     * item has media_type.
     */
    const normalizedItems = storedItems
      .filter((item) => item?.id)
      .map((item) => ({
        ...item,
        media_type: getMediaType(item),
      }));

    setItems(normalizedItems);
    setLoading(false);
  }, [
    user?.uid,
    activeProfile?.id,
    profileLoading,
  ]);

  /* =======================================================
     SAVE LIST
  ======================================================= */

  const persist = useCallback(
    (nextItems) => {
      if (
        !user?.uid ||
        !activeProfile?.id
      ) {
        return;
      }

      const key = getMyListKey(
        user.uid,
        activeProfile.id
      );

      saveStorage(
        key,
        nextItems
      );
    },
    [
      user?.uid,
      activeProfile?.id,
    ]
  );

  /* =======================================================
     ADD TO MY LIST
  ======================================================= */

  const addToList = useCallback(
    (media) => {
      if (
        !media?.id ||
        !user?.uid ||
        !activeProfile?.id
      ) {
        return;
      }

      setItems((currentItems) => {
        const mediaType =
          getMediaType(media);

        const newItemKey =
          `${mediaType}-${media.id}`;

        /*
         * Check for duplicate.
         */
        const alreadyExists =
          currentItems.some(
            (item) =>
              getItemKey(item) ===
              newItemKey
          );

        if (alreadyExists) {
          return currentItems;
        }

        /*
         * Store a clean media object.
         */
        const newItem = {
          ...media,
          media_type: mediaType,
          addedAt:
            new Date().toISOString(),
        };

        /*
         * Newest items appear first.
         */
        const nextItems = [
          newItem,
          ...currentItems,
        ];

        /*
         * Persist immediately.
         */
        persist(nextItems);

        return nextItems;
      });
    },
    [
      persist,
      user?.uid,
      activeProfile?.id,
    ]
  );

  /* =======================================================
     REMOVE FROM MY LIST
  ======================================================= */

  const removeFromList = useCallback(
    (
      mediaId,
      mediaType = null
    ) => {
      if (!mediaId) {
        return;
      }

      setItems((currentItems) => {
        const nextItems =
          currentItems.filter(
            (item) => {
              /*
               * If media type is supplied,
               * compare both ID and type.
               */
              if (mediaType) {
                return !(
                  item.id === mediaId &&
                  getMediaType(item) ===
                    mediaType
                );
              }

              /*
               * Otherwise remove by ID.
               */
              return item.id !== mediaId;
            }
          );

        persist(nextItems);

        return nextItems;
      });
    },
    [persist]
  );

  /* =======================================================
     TOGGLE MY LIST
  ======================================================= */

  const toggleMyList = useCallback(
    (media) => {
      if (!media?.id) {
        return false;
      }

      const mediaType =
        getMediaType(media);

      const exists =
        items.some(
          (item) =>
            item.id === media.id &&
            getMediaType(item) ===
              mediaType
        );

      if (exists) {
        removeFromList(
          media.id,
          mediaType
        );

        return false;
      }

      addToList({
        ...media,
        media_type: mediaType,
      });

      return true;
    },
    [
      items,
      addToList,
      removeFromList,
    ]
  );

  /* =======================================================
     CHECK IF ITEM IS IN MY LIST
  ======================================================= */

  const isInMyList = useCallback(
    (
      mediaId,
      mediaType = null
    ) => {
      if (!mediaId) {
        return false;
      }

      return items.some(
        (item) => {
          /*
           * If type is supplied,
           * compare ID + type.
           */
          if (mediaType) {
            return (
              item.id === mediaId &&
              getMediaType(item) ===
                mediaType
            );
          }

          /*
           * Otherwise compare ID only.
           */
          return item.id === mediaId;
        }
      );
    },
    [items]
  );

  /* =======================================================
     CLEAR MY LIST
  ======================================================= */

  const clearMyList = useCallback(() => {
    setItems([]);

    persist([]);
  }, [persist]);

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = useMemo(
    () => ({
      /*
       * Main list.
       */
      items,

      /*
       * Alias.
       *
       * This allows components using either
       * `items` or `myList` to work.
       */
      myList: items,

      /*
       * Loading state.
       */
      loading,

      /*
       * Number of saved items.
       */
      count: items.length,

      /*
       * Actions.
       */
      addToList,
      removeFromList,
      toggleMyList,
      isInMyList,
      clearMyList,
    }),
    [
      items,
      loading,
      addToList,
      removeFromList,
      toggleMyList,
      isInMyList,
      clearMyList,
    ]
  );

  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <MyListContext.Provider value={value}>
      {children}
    </MyListContext.Provider>
  );
};

export default MyListContext;