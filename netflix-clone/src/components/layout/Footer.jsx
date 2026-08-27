import React from "react";
import { Link } from "react-router-dom";

const footerLinks = [
  {
    title: "Navigation",
    links: [
      {
        label: "Home",
        to: "/",
      },
      {
        label: "Movies",
        to: "/movies",
      },
      {
        label: "TV Shows",
        to: "/tv",
      },
      {
        label: "My List",
        to: "/mylist",
      },
    ],
  },
  {
    title: "Account",
    links: [
      {
        label: "Profile",
        to: "/profile",
      },
      {
        label: "Account",
        to: "/account",
      },
    ],
  },
];

const Footer = () => {
  const currentYear =
    new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-[1600px] px-6 py-12 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          {/* =================================================
              BRAND
          ================================================= */}

          <div>
            <Link
              to="/"
              className="inline-block text-2xl font-black tracking-[-0.08em] text-red-600 transition hover:text-red-500"
            >
              NETFLIX
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-500">
              Your entertainment hub for
              movies, TV shows, trending
              content, and personalized
              recommendations.
            </p>

            <p className="mt-5 text-xs text-zinc-600">
              This is a Netflix-inspired
              educational project and is not
              affiliated with Netflix.
            </p>
          </div>

          {/* =================================================
              LINKS
          ================================================= */}

          {footerLinks.map(
            (section) => (
              <div
                key={section.title}
              >
                <h3 className="text-sm font-semibold text-white">
                  {section.title}
                </h3>

                <ul className="mt-4 space-y-3">
                  {section.links.map(
                    (link) => (
                      <li
                        key={link.to}
                      >
                        <Link
                          to={link.to}
                          className="text-sm text-zinc-500 transition hover:text-white"
                        >
                          {link.label}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )
          )}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-600">
            © {currentYear} Netflix Clone.
            All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link
              to="/account"
              className="text-xs text-zinc-600 transition hover:text-white"
            >
              Privacy
            </Link>

            <Link
              to="/account"
              className="text-xs text-zinc-600 transition hover:text-white"
            >
              Terms
            </Link>

            <Link
              to="/account"
              className="text-xs text-zinc-600 transition hover:text-white"
            >
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;