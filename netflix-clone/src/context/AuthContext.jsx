import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  auth,
} from "../firebase/firebase";

import {
  login as loginUser,
  logout as logoutUser,
  resetPassword as resetUserPassword,
  signup as signupUser,
} from "../services/auth";

const AuthContext =
  createContext(null);

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [authError, setAuthError] =
    useState(null);

  useEffect(() => {
    let mounted = true;

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (firebaseUser) => {
          if (!mounted) return;

          setUser(firebaseUser);
          setLoading(false);
        },
        (error) => {
          if (!mounted) return;

          console.error(
            "Firebase auth state error:",
            error
          );

          setAuthError(error);
          setUser(null);
          setLoading(false);
        }
      );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const login = useCallback(
    async (email, password) => {
      setAuthError(null);

      try {
        const result =
          await loginUser(
            email,
            password
          );

        return result;
      } catch (error) {
        setAuthError(error);
        throw error;
      }
    },
    []
  );

  const signup = useCallback(
    async (
      email,
      password,
      displayName = ""
    ) => {
      setAuthError(null);

      try {
        const result =
          await signupUser(
            email,
            password,
            displayName
          );

        return result;
      } catch (error) {
        setAuthError(error);
        throw error;
      }
    },
    []
  );

  const logout = useCallback(
    async () => {
      setAuthError(null);

      try {
        await logoutUser();
      } catch (error) {
        setAuthError(error);
        throw error;
      }
    },
    []
  );

  const resetPassword =
    useCallback(async (email) => {
      setAuthError(null);

      try {
        return await resetUserPassword(
          email
        );
      } catch (error) {
        setAuthError(error);
        throw error;
      }
    }, []);

  const clearAuthError =
    useCallback(() => {
      setAuthError(null);
    }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      authError,

      login,
      signup,
      logout,
      resetPassword,
      clearAuthError,
    }),
    [
      user,
      loading,
      authError,
      login,
      signup,
      logout,
      resetPassword,
      clearAuthError,
    ]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;