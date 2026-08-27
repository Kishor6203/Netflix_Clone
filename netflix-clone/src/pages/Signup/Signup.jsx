import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const PASSWORD_CHECKS = [
  ["length", "At least 8 characters"],
  ["upper", "One uppercase letter"],
  ["number", "One number"],
];

const Signup = () => {
  const { user, signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const passwordChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (Object.values(passwordChecks).some((valid) => !valid)) {
      setError(
        "Password must contain at least 8 characters, one uppercase letter and one number."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await signup(email.trim(), password);
      navigate("/", { replace: true });
    } catch (err) {
      const messages = {
        "auth/email-already-in-use":
          "An account already exists with this email.",
        "auth/invalid-email":
          "Please enter a valid email address.",
      };

      setError(
        messages[err?.code] ||
          err?.message ||
          "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-md rounded-lg bg-black/80 p-8 sm:p-10">
        <Link to="/" className="text-3xl font-black text-red-600">
          NETFLIX
        </Link>

        <h1 className="mt-8 text-3xl font-bold text-white">
          Create account
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Start watching movies and shows.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              autoComplete="email"
              required
              className="h-14 w-full rounded border border-zinc-700 bg-zinc-900 pl-11 pr-4 text-white outline-none placeholder:text-zinc-500 focus:border-white"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="new-password"
              required
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

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            autoComplete="new-password"
            required
            className="h-14 w-full rounded border border-zinc-700 bg-zinc-900 px-4 text-white outline-none placeholder:text-zinc-500 focus:border-white"
          />

          <div className="rounded-md bg-zinc-900 p-4">
            <p className="mb-3 text-xs font-semibold text-zinc-400">
              Password requirements
            </p>

            {PASSWORD_CHECKS.map(([key, label]) => {
              const valid = passwordChecks[key];

              return (
                <div
                  key={key}
                  className={`flex items-center gap-2 text-xs ${
                    valid ? "text-green-400" : "text-zinc-500"
                  }`}
                >
                  <CheckCircle2 size={14} />
                  {label}
                </div>
              );
            })}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded bg-red-600 font-bold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-8 text-zinc-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-white hover:underline"
          >
            Sign in.
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Signup;