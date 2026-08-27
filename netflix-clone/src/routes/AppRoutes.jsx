import { Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";

import Home from "../pages/Home/Home";
import Movies from "../pages/Movies/Movies";
import TVShows from "../pages/TVShows/TVShows";
import Movie from "../pages/Movie/Movie";
import TVDetails from "../pages/TVDetails/TVDetails";
import Search from "../pages/Search/Search";
import MyList from "../pages/MyList/MyList";
import Profile from "../pages/Profile/Profile";
import Account from "../pages/Account/Account";

import NotFound from "../pages/NotFound/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />

        <Route path="movies" element={<Movies />} />

        <Route path="tv" element={<TVShows />} />

        {/* Movie details */}
        <Route
          path="movie/:id"
          element={<Movie />}
        />

        {/* TV details */}
        <Route
          path="tv/:id"
          element={<TVDetails />}
        />

        <Route
          path="search"
          element={<Search />}
        />

        <Route
          path="mylist"
          element={<MyList />}
        />

        <Route
          path="profile"
          element={<Profile />}
        />

        <Route
          path="account"
          element={<Account />}
        />
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
};

export default AppRoutes;