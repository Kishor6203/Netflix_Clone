import React from "react";

import {
  Film,
  Home,
  ArrowLeft,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

const NotFound = () => {
  const navigate =
    useNavigate();

  return (
    <main
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-[#141414]
        px-4
        text-white
      "
    >
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
          <Film
            size={34}
            className="text-zinc-500"
          />
        </div>

        <p className="mt-8 text-sm font-bold uppercase tracking-[0.3em] text-red-500">
          Error 404
        </p>

        <h1 className="mt-3 text-4xl font-black sm:text-6xl">
          Lost in streaming?
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-zinc-500">
          The page you're looking for doesn't
          exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-bold text-black hover:bg-zinc-200"
          >
            <Home size={17} />
            Go home
          </Link>

          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="flex items-center gap-2 rounded-md bg-white/10 px-5 py-3 text-sm font-bold hover:bg-white/20"
          >
            <ArrowLeft size={17} />
            Go back
          </button>
        </div>
      </div>
    </main>
  );
};

export default NotFound;