import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Rundal Zed");
  const [bio, setBio] = useState(
    "Adventurer, lore seeker, occasional DM. Keep your profile short and sweet.",
  );
  const [editing, setEditing] = useState(false);

  // Placeholder data — replace with real data when available
  const email = "rundal@example.com";
  const maskedPassword = "*****";
  const charactersCreated = 7;
  const dmCampaigns = 2;
  const playerCampaigns = 3;
  const totalCampaigns = dmCampaigns + playerCampaigns;

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
            onClick={() => setEditing((prev) => !prev)}
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
                    {username}
                  </p>
                ) : (
                  <input
                    className="mt-2 h-10 w-full border border-gold-neutral bg-dark px-3 outline-none"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                )}
              </div>

              <div>
                <p className="text-xs tracking-widest text-gray-light">EMAIL</p>
                <p className="mt-2">{email}</p>
              </div>
            </div>

            <div className="mt-5 border-t border-gold-dark pt-5">
              <p className="text-xs tracking-widest text-gray-light">
                PASSWORD
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <p className="tracking-widest">{maskedPassword}</p>
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
                <p className="mt-2 max-w-2xl text-sm text-gray-light">{bio}</p>
              ) : (
                <textarea
                  className="mt-2 min-h-28 w-full resize-none border border-gold-neutral bg-dark p-3 outline-none"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              )}
            </div>
          </section>

          <aside className="flex flex-col gap-4">
            <div className="border-2 border-gold-neutral bg-neutral p-5">
              <div className="pb-3">
                <p className="text-xs uppercase tracking-widest text-gold-light">
                  Stats
                </p>
                <h3 className="mt-2 text-lg font-semibold">Activity</h3>
              </div>
              <hr className="border-gold-dark" />

              <div className="mt-4 flex flex-col gap-3">
                <div className="border border-gold-dark bg-dark px-4 py-3">
                  <p className="text-xs uppercase tracking-widest text-gray-light">
                    Characters
                  </p>
                  <p className="mt-1 text-2xl font-bold">{charactersCreated}</p>
                </div>
                <div className="border border-gold-dark bg-dark px-4 py-3">
                  <p className="text-xs uppercase tracking-widest text-gray-light">
                    Campaigns
                  </p>
                  <p className="mt-1 text-2xl font-bold">{totalCampaigns}</p>
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
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Profile;
