import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../../context/AuthContext";

const profileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .max(50, "Username must be 50 characters or less"),
  bio: z.string().trim().max(500, "Bio must be 500 characters or less"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

function Profile() {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated, updateUser, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProfileFormData, string>>
  >({});

  useEffect(() => {
    if (user?.name) {
      setUsername(user.name);
    }
    if (typeof user?.bio === "string") {
      setBio(user.bio);
    }
  }, [user?.bio, user?.name]);

  const email = user?.email ?? "Not available";
  const role = user?.role ?? "User";
  const joinedAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";

  if (isLoading) {
    return (
      <div className="min-h-screen ml-64 bg-dark px-6 py-10 text-gray-light flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <div className="min-h-screen ml-64 bg-dark text-neutral-text px-6 py-10 lg:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex items-end justify-between border-b border-gold-dark pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-widest">PROFILE</h1>
            <p className="mt-1 text-sm text-gray-light">Account overview</p>
          </div>
          <button
            className="h-9 border border-gold-neutral bg-neutral px-4 text-sm tracking-wide hover:bg-gold-neutral cursor-pointer"
            onClick={async () => {
              if (editing) {
                const result = profileSchema.safeParse({ username, bio });
                if (!result.success) {
                  const fieldErrors = result.error.flatten().fieldErrors;
                  setErrors({
                    username: fieldErrors.username?.[0],
                    bio: fieldErrors.bio?.[0],
                  });
                  return;
                }
                await updateUser({ name: username.trim(), bio: bio.trim() });
                setErrors({});
              } else {
                setErrors({});
              }
              setEditing((prev) => !prev);
            }}
          >
            {editing ? "SAVE" : "EDIT PROFILE"}
          </button>
        </header>

        <div className="grid gap-6 lg:grid-cols-4">
          <section className="col-span-3 border-2 border-gold-neutral bg-neutral p-6">
            <div className="pb-4">
              <p className="text-xs uppercase tracking-widest text-gold-light">
                Profile Info
              </p>
              <h2 className="mt-2 text-xl font-semibold">Personal Details</h2>
            </div>

            <hr className="border-gold-dark" />

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs tracking-widest text-gray-light">
                  USERNAME
                </p>
                {!editing ? (
                  <p className="mt-2 text-lg font-bold tracking-wide">
                    {username || "Not available"}
                  </p>
                ) : (
                  <>
                    <input
                      className="mt-2 h-10 w-full border border-gold-neutral bg-dark px-3 outline-none"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    {errors.username && (
                      <p className="mt-1 text-xs text-error">
                        {errors.username}
                      </p>
                    )}
                  </>
                )}
              </div>

              <div>
                <p className="text-xs tracking-widest text-gray-light">EMAIL</p>
                <p className="mt-2">{email}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs tracking-widest text-gray-light">ROLE</p>
                <p className="mt-2 text-sm uppercase tracking-widest text-gold-light">
                  {role}
                </p>
              </div>

              <div>
                <p className="text-xs tracking-widest text-gray-light">
                  MEMBER SINCE
                </p>
                <p className="mt-2 text-sm">{joinedAt}</p>
              </div>
            </div>

            <div className="mt-5 border-t border-gold-dark pt-5">
              <p className="text-xs tracking-widest text-gray-light">
                PASSWORD
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <p className="tracking-widest">*****</p>
                <button
                  className="h-8 border border-gold-neutral bg-dark px-3 text-xs tracking-wide hover:bg-gold-neutral cursor-pointer"
                  onClick={() => navigate("/reset-password")}
                >
                  CHANGE PASSWORD
                </button>
              </div>
            </div>

            <div className="mt-5 border-t border-gold-dark pt-5">
              <p className="text-xs tracking-widest text-gray-light">ABOUT</p>
              {!editing ? (
                <p className="mt-2 max-w-2xl text-sm text-gray-light">
                  {bio || "No bio added yet."}
                </p>
              ) : (
                <>
                  <textarea
                    className="mt-2 w-full min-h-48 resize-none border border-gold-neutral bg-dark p-3 outline-none"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                  {errors.bio && (
                    <p className="mt-1 text-xs text-error">{errors.bio}</p>
                  )}
                </>
              )}
            </div>
          </section>

          <aside className="flex flex-col gap-4">
            <div className="border-2 border-gold-neutral bg-neutral p-5">
              <div className="pb-3">
                <p className="text-xs uppercase tracking-widest text-gold-light">
                  Account
                </p>
                <h3 className="mt-2 text-lg font-semibold">Summary</h3>
              </div>
              <hr className="border-gold-dark" />

              <div className="mt-4 flex flex-col gap-3">
                <div className="border border-gold-dark bg-dark px-4 py-3">
                  <p className="text-xs uppercase tracking-widest text-gray-light">
                    Name
                  </p>
                  <p className="mt-1 text-lg font-bold">
                    {username || "Not available"}
                  </p>
                </div>
                <div className="border border-gold-dark bg-dark px-4 py-3">
                  <p className="text-xs uppercase tracking-widest text-gray-light">
                    Email
                  </p>
                  <p className="mt-1 text-sm break-all">{email}</p>
                </div>
                <div className="border border-gold-dark bg-dark px-4 py-3">
                  <p className="text-xs uppercase tracking-widest text-gray-light">
                    Role
                  </p>
                  <p className="mt-1 text-sm uppercase tracking-widest text-gold-light">
                    {role}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-2 border-gold-neutral bg-neutral p-5">
              <p className="text-xs uppercase tracking-widest text-gold-light">
                Support
              </p>
              <p className="mt-2 text-sm text-gray-light">
                Found a bug or have a suggestion?
              </p>
              <button
                className="mt-4 h-9 w-full border border-gold-neutral bg-dark px-3 text-xs tracking-wide hover:bg-gold-neutral cursor-pointer"
                onClick={() => navigate("/contact")}
              >
                CONTACT / FEEDBACK
              </button>
            </div>

            <div className="border-2 border-gold-neutral bg-neutral p-5">
              <p className="text-xs uppercase tracking-widest text-gold-light">
                Session
              </p>
              <p className="mt-2 text-sm text-gray-light">
                Sign out of your account
              </p>
              <button
                className="mt-4 h-9 w-full border border-error bg-dark px-3 text-xs tracking-wide hover:bg-error cursor-pointer"
                onClick={async () => {
                  await logout();
                  navigate("/");
                }}
              >
                LOGOUT
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Profile;
