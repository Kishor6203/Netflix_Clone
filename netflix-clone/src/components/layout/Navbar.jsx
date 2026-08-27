import React, {
    useEffect,
    useRef,
    useState,
  } from "react";
  
  import {
    Link,
    NavLink,
    useLocation,
    useNavigate,
  } from "react-router-dom";
  
  import {
    Menu,
    X,
    Search,
    Bell,
    ChevronDown,
    User,
    Settings,
    LogOut,
    Film,
    Tv,
    List,
    Home,
  } from "lucide-react";
  
  import { logout } from "../../services/auth";
  
  const navItems = [
    {
      label: "Home",
      to: "/",
      icon: Home,
    },
    {
      label: "Movies",
      to: "/movies",
      icon: Film,
    },
    {
      label: "TV Shows",
      to: "/tv",
      icon: Tv,
    },
    {
      label: "My List",
      to: "/mylist",
      icon: List,
    },
  ];
  
  const Navbar = ({
    user = null,
    onLogout,
  }) => {
    const location = useLocation();
    const navigate = useNavigate();
  
    const [scrolled, setScrolled] =
      useState(false);
  
    const [mobileOpen, setMobileOpen] =
      useState(false);
  
    const [profileOpen, setProfileOpen] =
      useState(false);
  
    const profileRef = useRef(null);
  
    /* =====================================================
       SCROLL EFFECT
    ===================================================== */
  
    useEffect(() => {
      const handleScroll = () => {
        setScrolled(
          window.scrollY > 30
        );
      };
  
      handleScroll();
  
      window.addEventListener(
        "scroll",
        handleScroll,
        { passive: true }
      );
  
      return () => {
        window.removeEventListener(
          "scroll",
          handleScroll
        );
      };
    }, []);
  
    /* =====================================================
       CLOSE MENUS ON ROUTE CHANGE
    ===================================================== */
  
    useEffect(() => {
      setMobileOpen(false);
      setProfileOpen(false);
    }, [location.pathname]);
  
    /* =====================================================
       LOCK BODY WHEN MOBILE MENU OPEN
    ===================================================== */
  
    useEffect(() => {
      if (!mobileOpen) {
        document.body.style.overflow = "";
        return;
      }
  
      document.body.style.overflow =
        "hidden";
  
      return () => {
        document.body.style.overflow = "";
      };
    }, [mobileOpen]);
  
    /* =====================================================
       OUTSIDE CLICK
    ===================================================== */
  
    useEffect(() => {
      const handleClick = (event) => {
        if (
          profileRef.current &&
          !profileRef.current.contains(
            event.target
          )
        ) {
          setProfileOpen(false);
        }
      };
  
      document.addEventListener(
        "mousedown",
        handleClick
      );
  
      return () => {
        document.removeEventListener(
          "mousedown",
          handleClick
        );
      };
    }, []);
  
    /* =====================================================
       ESCAPE
    ===================================================== */
  
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key !== "Escape") {
          return;
        }
  
        setMobileOpen(false);
        setProfileOpen(false);
      };
  
      document.addEventListener(
        "keydown",
        handleKeyDown
      );
  
      return () => {
        document.removeEventListener(
          "keydown",
          handleKeyDown
        );
      };
    }, []);
  
    /* =====================================================
       LOGOUT
    ===================================================== */
  
    const handleLogout = async () => {
      try {
        await logout();
        onLogout?.();
        navigate("/login", {
          replace: true,
        });
      } catch (error) {
        console.error(
          "Logout failed:",
          error
        );
      }
    };
  
    /* =====================================================
       SEARCH
    ===================================================== */
  
    const handleSearch = () => {
      navigate("/search");
    };
  
    const displayName =
      user?.displayName ||
      user?.email?.split("@")[0] ||
      "User";
  
    const photoURL =
      user?.photoURL || null;
  
    return (
      <>
        <header
          className={[
            "fixed inset-x-0 top-0 z-50 transition-all duration-300",
            scrolled
              ? "bg-black/95 shadow-lg backdrop-blur-xl"
              : "bg-gradient-to-b from-black/80 via-black/30 to-transparent",
          ].join(" ")}
        >
          <div className="mx-auto flex h-16 max-w-[1920px] items-center px-4 sm:px-6 lg:h-[72px] lg:px-10">
            {/* =================================================
                MOBILE MENU BUTTON
            ================================================= */}
  
            <button
              type="button"
              onClick={() =>
                setMobileOpen(true)
              }
              className="mr-3 flex h-10 w-10 items-center justify-center rounded-md text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white lg:hidden"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="h-6 w-6" />
            </button>
  
            {/* =================================================
                LOGO
            ================================================= */}
  
            <Link
              to="/"
              className="group shrink-0"
              aria-label="Netflix Clone home"
            >
              <span className="text-2xl font-black tracking-[-0.08em] text-red-600 transition group-hover:text-red-500 sm:text-3xl">
                NETFLIX
              </span>
            </Link>
  
            {/* =================================================
                DESKTOP NAV
            ================================================= */}
  
            <nav
              className="ml-8 hidden items-center gap-1 lg:flex"
              aria-label="Primary navigation"
            >
              {navItems.map(
                ({
                  label,
                  to,
                }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/"}
                    className={({ isActive }) =>
                      [
                        "rounded-md px-4 py-2 text-sm font-medium transition",
                        isActive
                          ? "text-white"
                          : "text-zinc-400 hover:text-white",
                      ].join(" ")
                    }
                  >
                    {label}
                  </NavLink>
                )
              )}
            </nav>
  
            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              {/* =================================================
                  SEARCH
              ================================================= */}
  
              <button
                type="button"
                onClick={handleSearch}
                className="flex h-10 w-10 items-center justify-center rounded-md text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
  
              {/* =================================================
                  NOTIFICATIONS
              ================================================= */}
  
              <button
                type="button"
                className="relative hidden h-10 w-10 items-center justify-center rounded-md text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:flex"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
  
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-600" />
              </button>
  
              {/* =================================================
                  PROFILE
              ================================================= */}
  
              <div
                ref={profileRef}
                className="relative ml-1"
              >
                <button
                  type="button"
                  onClick={() =>
                    setProfileOpen(
                      (value) => !value
                    )
                  }
                  className="flex items-center gap-2 rounded-md p-1 outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-expanded={
                    profileOpen
                  }
                  aria-haspopup="menu"
                  aria-label="Open account menu"
                >
                  {photoURL ? (
                    <img
                      src={photoURL}
                      alt=""
                      className="h-8 w-8 rounded object-cover sm:h-9 sm:w-9"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-red-600 text-xs font-bold text-white sm:h-9 sm:w-9">
                      {displayName
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
  
                  <ChevronDown
                    className={[
                      "hidden h-4 w-4 text-white transition-transform sm:block",
                      profileOpen
                        ? "rotate-180"
                        : "",
                    ].join(" ")}
                  />
                </button>
  
                {profileOpen && (
                  <div
                    className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-lg border border-white/10 bg-zinc-950 shadow-2xl"
                    role="menu"
                  >
                    <div className="border-b border-white/10 px-4 py-4">
                      <p className="truncate text-sm font-semibold text-white">
                        {displayName}
                      </p>
  
                      {user?.email && (
                        <p className="mt-1 truncate text-xs text-zinc-500">
                          {user.email}
                        </p>
                      )}
                    </div>
  
                    <div className="p-2">
                      <Link
                        to="/profile"
                        role="menuitem"
                        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
  
                      <Link
                        to="/account"
                        role="menuitem"
                        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
                      >
                        <Settings className="h-4 w-4" />
                        Account
                      </Link>
  
                      <button
                        type="button"
                        role="menuitem"
                        onClick={
                          handleLogout
                        }
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
  
        {/* =====================================================
            MOBILE NAV
        ===================================================== */}
  
        {mobileOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() =>
                setMobileOpen(false)
              }
              aria-label="Close navigation menu"
            />
  
            <aside className="relative h-full w-[300px] max-w-[85vw] overflow-y-auto border-r border-white/10 bg-zinc-950 shadow-2xl">
              <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
                <span className="text-2xl font-black tracking-[-0.08em] text-red-600">
                  NETFLIX
                </span>
  
                <button
                  type="button"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-md text-zinc-400 hover:bg-white/10 hover:text-white"
                  aria-label="Close navigation menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
  
              <div className="p-4">
                <div className="mb-5 flex items-center gap-3 rounded-lg bg-white/5 p-3">
                  {photoURL ? (
                    <img
                      src={photoURL}
                      alt=""
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-red-600 font-bold text-white">
                      {displayName
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
  
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {displayName}
                    </p>
  
                    <p className="text-xs text-zinc-500">
                      Netflix Member
                    </p>
                  </div>
                </div>
  
                <nav
                  className="space-y-1"
                  aria-label="Mobile navigation"
                >
                  {navItems.map(
                    ({
                      label,
                      to,
                      icon: Icon,
                    }) => (
                      <NavLink
                        key={to}
                        to={to}
                        end={to === "/"}
                        className={({ isActive }) =>
                          [
                            "flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium transition",
                            isActive
                              ? "bg-red-600 text-white"
                              : "text-zinc-400 hover:bg-white/5 hover:text-white",
                          ].join(" ")
                        }
                      >
                        <Icon className="h-5 w-5" />
                        {label}
                      </NavLink>
                    )
                  )}
  
                  <NavLink
                    to="/search"
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium transition",
                        isActive
                          ? "bg-red-600 text-white"
                          : "text-zinc-400 hover:bg-white/5 hover:text-white",
                      ].join(" ")
                    }
                  >
                    <Search className="h-5 w-5" />
                    Search
                  </NavLink>
  
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium transition",
                        isActive
                          ? "bg-red-600 text-white"
                          : "text-zinc-400 hover:bg-white/5 hover:text-white",
                      ].join(" ")
                    }
                  >
                    <User className="h-5 w-5" />
                    Profile
                  </NavLink>
  
                  <NavLink
                    to="/account"
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium transition",
                        isActive
                          ? "bg-red-600 text-white"
                          : "text-zinc-400 hover:bg-white/5 hover:text-white",
                      ].join(" ")
                    }
                  >
                    <Settings className="h-5 w-5" />
                    Account
                  </NavLink>
                </nav>
  
                <div className="my-5 h-px bg-white/10" />
  
                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                >
                  <LogOut className="h-5 w-5" />
                  Sign out
                </button>
              </div>
            </aside>
          </div>
        )}
      </>
    );
  };
  
  export default Navbar;