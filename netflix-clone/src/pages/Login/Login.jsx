import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from || "/";

  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true });
  }, [user, navigate, redirectTo]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const code = err?.code || "";

      if (code === "auth/invalid-credential") {
        setError("Incorrect email or password.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError(err?.message || "Unable to sign in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-md rounded-lg bg-black/80 p-8 sm:p-10">
        <div className="mb-8">
          <Link
            to="/"
            className="text-3xl font-black tracking-tight text-red-600"
          >
            NETFLIX
          </Link>
          <h1 className="mt-8 text-3xl font-bold text-white">Sign In</h1>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              autoComplete="email"
              className="h-14 w-full rounded border border-zinc-700 bg-zinc-900 pl-11 pr-4 text-white outline-none placeholder:text-zinc-500 focus:border-white"
            />
          </div>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className="h-14 w-full rounded border border-zinc-700 bg-zinc-900 pl-11 pr-12 text-white outline-none placeholder:text-zinc-500 focus:border-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded bg-red-600 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-zinc-500">
          New to Netflix Clone?{" "}
          <Link
            to="/signup"
            className="font-semibold text-white hover:underline"
          >
            Sign up now.
          </Link>
        </p>

        <p className="mt-6 text-xs leading-5 text-zinc-600">
          This page uses Firebase Authentication. Never share your password
          with anyone.
        </p>
      </div>
    </main>
  );
};

export default Login;