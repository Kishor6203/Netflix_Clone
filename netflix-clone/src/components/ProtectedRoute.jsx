import React from "react";

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import useAuth from "../hooks/useAuth";

const AuthLoadingScreen = () => (
  <div
    className="
      flex
      min-h-screen
      items-center
      justify-center
      bg-[#141414]
    "
  >
    <div
      className="
        flex
        flex-col
        items-center
        gap-4
      "
    >
      <div
        className="
          h-10
          w-10
          animate-spin
          rounded-full
          border-4
          border-zinc-800
          border-t-red-600
        "
      />

      <span
        className="
          text-sm
          text-zinc-500
        "
      >
        Loading...
      </span>
    </div>
  </div>
);

const ProtectedRoute = ({
  children,
}) => {
  const {
    user,
    loading,
  } = useAuth();

  const location =
    useLocation();

  if (loading) {
    return (
      <AuthLoadingScreen />
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname +
            location.search,
        }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;