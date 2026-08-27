import { useState } from "react";
import { AlertTriangle, LogOut, Mail, Shield, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#141414] px-4 pb-20 pt-24 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-500">
            Settings
          </p>
          <h1 className="mt-2 text-3xl font-black">Account</h1>
        </div>

        <div className="space-y-4">
          <section className="rounded-xl border border-white/10 bg-zinc-950 p-6">
            <div className="flex items-center gap-3">
              <User className="text-zinc-400" />
              <div>
                <h2 className="font-bold">Account information</h2>
                <p className="text-sm text-zinc-500">
                  Your Netflix Clone account
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Email
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-zinc-500" />
                  {user?.email || "Not available"}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  User ID
                </p>
                <p className="mt-2 break-all text-sm text-zinc-400">
                  {user?.uid || "Not available"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-zinc-950 p-6">
            <div className="flex items-center gap-3">
              <Shield className="text-zinc-400" />
              <div>
                <h2 className="font-bold">Security</h2>
                <p className="text-sm text-zinc-500">Manage your sign-in</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="mt-6 rounded-md border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold hover:bg-white/10"
            >
              Manage profile
            </button>
          </section>

          <section className="rounded-xl border border-red-500/10 bg-red-950/10 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="shrink-0 text-red-500" />
              <div>
                <h2 className="font-bold">Sign out</h2>
                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  Sign out of this account on this device.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={loggingOut}
              onClick={handleLogout}
              className="mt-6 flex items-center gap-2 rounded-md bg-red-600 px-5 py-2.5 text-sm font-bold hover:bg-red-700 disabled:opacity-50"
            >
              <LogOut size={17} />
              {loggingOut ? "Signing out..." : "Sign out"}
            </button>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Account;