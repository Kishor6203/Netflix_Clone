import { useEffect, useState } from "react";
import { Check, Save, User } from "lucide-react";

import useAuth from "../../hooks/useAuth";
import useProfile from "../../hooks/useProfile";

const AVATARS = [
  "https://api.dicebear.com/9.x/bottts/svg?seed=netflix1",
  "https://api.dicebear.com/9.x/bottts/svg?seed=netflix2",
  "https://api.dicebear.com/9.x/bottts/svg?seed=netflix3",
  "https://api.dicebear.com/9.x/bottts/svg?seed=netflix4",
  "https://api.dicebear.com/9.x/bottts/svg?seed=netflix5",
];

const Profile = () => {
  const { user } = useAuth();
  const { profile, loading, saving, updateProfile } = useProfile();

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!profile) return;

    setName(
      profile.displayName ||
        profile.name ||
        user?.displayName ||
        ""
    );

    setAvatar(
      profile.photoURL ||
        profile.avatar ||
        user?.photoURL ||
        AVATARS[0]
    );
  }, [profile, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaved(false);

    await updateProfile({
      displayName: name.trim(),
      photoURL: avatar,
      avatar,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] pt-24">
        <div className="mx-auto max-w-2xl animate-pulse px-4">
          <div className="h-8 w-40 rounded bg-zinc-800" />
          <div className="mt-8 h-96 rounded-lg bg-zinc-900" />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#141414] px-4 pb-20 pt-24 text-white sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-500">
            Personalization
          </p>
          <h1 className="mt-2 text-3xl font-black">Profile</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-white/10 bg-zinc-950 p-6 sm:p-8"
        >
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 overflow-hidden rounded-md bg-zinc-800">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Profile avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <User />
                </div>
              )}
            </div>

            <h2 className="mt-4 text-lg font-bold">Choose your avatar</h2>
          </div>

          <div className="mt-6 grid grid-cols-5 gap-3">
            {AVATARS.map((item) => {
              const selected = avatar === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setAvatar(item)}
                  className={`relative aspect-square overflow-hidden rounded-md border-2 ${
                    selected ? "border-red-600" : "border-transparent"
                  }`}
                >
                  <img
                    src={item}
                    alt=""
                    className="h-full w-full bg-zinc-800"
                  />

                  {selected && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Check />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            <label className="text-sm font-semibold">Display name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              placeholder="Your name"
              className="mt-2 w-full rounded-md border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-white/40"
            />
          </div>

          <div className="mt-5">
            <label className="text-sm font-semibold">Email</label>
            <input
              value={user?.email || ""}
              disabled
              className="mt-2 w-full rounded-md border border-white/5 bg-zinc-900/50 px-4 py-3 text-zinc-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-md bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {saved ? (
              <>
                <Check size={18} />
                Saved
              </>
            ) : (
              <>
                <Save size={18} />
                {saving ? "Saving..." : "Save profile"}
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Profile;