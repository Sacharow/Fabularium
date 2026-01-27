import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-950 via-orange-900 to-black text-white px-4 py-16">
      <div className="max-w-3xl mx-auto bg-orange-950/70 border border-orange-800 rounded-2xl shadow-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-yellow-300/80 uppercase tracking-widest">Profile</p>
            <h1 className="text-3xl font-bold">Your Account</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 transition-colors text-sm font-semibold"
          >
            Log out
          </button>
        </div>

        <div className="bg-black/40 border border-orange-800/60 rounded-xl p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Account</h2>
            <p className="text-sm text-gray-300">{user ? "Signed in" : "Checking session..."}</p>
          </div>

          {user && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-lg bg-orange-900/40 border border-orange-800/60">
                <p className="text-gray-400">Name</p>
                <p className="text-white font-semibold text-lg">{user.name}</p>
              </div>
              <div className="p-4 rounded-lg bg-orange-900/40 border border-orange-800/60">
                <p className="text-gray-400">Email</p>
                <p className="text-white font-semibold text-lg break-all">{user.email}</p>
              </div>
              <div className="p-4 rounded-lg bg-orange-900/40 border border-orange-800/60">
                <p className="text-gray-400">Role</p>
                <p className="text-white font-semibold text-lg uppercase">{user.role}</p>
              </div>
              <div className="p-4 rounded-lg bg-orange-900/40 border border-orange-800/60">
                <p className="text-gray-400">Created</p>
                <p className="text-white font-semibold text-lg">
                  {user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
