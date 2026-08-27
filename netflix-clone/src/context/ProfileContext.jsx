import React, {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
  } from "react";
  
  import useAuth from "../hooks/useAuth";
  
  import {
    getStorage,
    saveStorage,
  } from "../utils/storage";
  
  const ProfileContext =
    createContext(null);
  
  const getProfileStorageKey =
    (uid) =>
      `netflix_profiles_${uid}`;
  
  const getActiveProfileStorageKey =
    (uid) =>
      `netflix_active_profile_${uid}`;
  
  const createProfile = ({
    name,
    avatar,
  }) => ({
    id: crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`,
  
    name:
      name?.trim() || "Profile",
  
    avatar:
      avatar ||
      "https://i.pravatar.cc/150?img=12",
  
    kids: false,
  
    createdAt:
      new Date().toISOString(),
  });
  
  const DEFAULT_PROFILES = [
    {
      id: "default",
      name: "Main Profile",
      avatar:
        "https://i.pravatar.cc/150?img=12",
      kids: false,
      createdAt:
        new Date().toISOString(),
    },
  ];
  
  export const ProfileProvider = ({
    children,
  }) => {
    const { user } = useAuth();
  
    const [profiles, setProfiles] =
      useState([]);
  
    const [activeProfileId, setActiveProfileId] =
      useState(null);
  
    const [loading, setLoading] =
      useState(true);
  
    useEffect(() => {
      if (!user?.uid) {
        setProfiles([]);
        setActiveProfileId(null);
        setLoading(false);
        return;
      }
  
      setLoading(true);
  
      const profileKey =
        getProfileStorageKey(user.uid);
  
      const activeKey =
        getActiveProfileStorageKey(
          user.uid
        );
  
      let storedProfiles =
        getStorage(profileKey, null);
  
      if (
        !Array.isArray(storedProfiles) ||
        storedProfiles.length === 0
      ) {
        storedProfiles =
          DEFAULT_PROFILES.map(
            (profile) => ({
              ...profile,
              id:
                profile.id === "default"
                  ? `${user.uid}-default`
                  : profile.id,
            })
          );
  
        saveStorage(
          profileKey,
          storedProfiles
        );
      }
  
      const storedActiveProfile =
        getStorage(activeKey, null);
  
      const validActiveProfile =
        storedProfiles.find(
          (profile) =>
            profile.id ===
            storedActiveProfile
        );
  
      setProfiles(storedProfiles);
  
      setActiveProfileId(
        validActiveProfile
          ? validActiveProfile.id
          : storedProfiles[0].id
      );
  
      setLoading(false);
    }, [user?.uid]);
  
    const activeProfile = useMemo(
      () =>
        profiles.find(
          (profile) =>
            profile.id ===
            activeProfileId
        ) || null,
      [
        profiles,
        activeProfileId,
      ]
    );
  
    const persistProfiles =
      useCallback(
        (nextProfiles) => {
          if (!user?.uid) return;
  
          saveStorage(
            getProfileStorageKey(
              user.uid
            ),
            nextProfiles
          );
        },
        [user?.uid]
      );
  
    const switchProfile =
      useCallback(
        (profileId) => {
          if (!user?.uid) return;
  
          const exists =
            profiles.some(
              (profile) =>
                profile.id === profileId
            );
  
          if (!exists) return;
  
          setActiveProfileId(profileId);
  
          saveStorage(
            getActiveProfileStorageKey(
              user.uid
            ),
            profileId
          );
        },
        [profiles, user?.uid]
      );
  
    const addProfile = useCallback(
      ({
        name,
        avatar,
        kids = false,
      }) => {
        if (!user?.uid) {
          throw new Error(
            "You must be authenticated to create a profile."
          );
        }
  
        if (profiles.length >= 5) {
          throw new Error(
            "You can have a maximum of 5 profiles."
          );
        }
  
        const profile =
          createProfile({
            name,
            avatar,
          });
  
        profile.kids = Boolean(kids);
  
        const nextProfiles = [
          ...profiles,
          profile,
        ];
  
        setProfiles(nextProfiles);
        persistProfiles(
          nextProfiles
        );
  
        return profile;
      },
      [
        profiles,
        persistProfiles,
        user?.uid,
      ]
    );
  
    const updateProfile =
      useCallback(
        (profileId, updates) => {
          if (!user?.uid) return;
  
          const nextProfiles =
            profiles.map(
              (profile) =>
                profile.id === profileId
                  ? {
                      ...profile,
                      ...updates,
                      name:
                        updates.name !==
                        undefined
                          ? updates.name.trim()
                          : profile.name,
                    }
                  : profile
            );
  
          setProfiles(nextProfiles);
          persistProfiles(
            nextProfiles
          );
        },
        [
          profiles,
          persistProfiles,
          user?.uid,
        ]
      );
  
    const deleteProfile =
      useCallback(
        (profileId) => {
          if (!user?.uid) return;
  
          if (profiles.length <= 1) {
            throw new Error(
              "You must keep at least one profile."
            );
          }
  
          const nextProfiles =
            profiles.filter(
              (profile) =>
                profile.id !== profileId
            );
  
          setProfiles(nextProfiles);
          persistProfiles(
            nextProfiles
          );
  
          if (
            profileId ===
            activeProfileId
          ) {
            const nextActive =
              nextProfiles[0];
  
            setActiveProfileId(
              nextActive.id
            );
  
            saveStorage(
              getActiveProfileStorageKey(
                user.uid
              ),
              nextActive.id
            );
          }
        },
        [
          profiles,
          activeProfileId,
          persistProfiles,
          user?.uid,
        ]
      );
  
    const value = useMemo(
      () => ({
        profiles,
        activeProfile,
        activeProfileId,
        loading,
  
        switchProfile,
        addProfile,
        updateProfile,
        deleteProfile,
      }),
      [
        profiles,
        activeProfile,
        activeProfileId,
        loading,
        switchProfile,
        addProfile,
        updateProfile,
        deleteProfile,
      ]
    );
  
    return (
      <ProfileContext.Provider
        value={value}
      >
        {children}
      </ProfileContext.Provider>
    );
  };
  
  export default ProfileContext;