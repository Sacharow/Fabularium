import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
// import { GoogleIcon } from "../components/ui/GoogleIcon";
// import { FacebookIcon } from "../components/ui/FacebookIcon";
import CustomCheckbox from "../components/ui/CustomCheckbox";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      const credentials = identifier.includes("@")
        ? { email: identifier, password }
        : { name: identifier, password };
      await login(credentials);
      navigate("/campaigns");
    } catch (err) {
      console.error("Login failed", err);
    }
  };
  /*
  const thirdParty = [
    { icon: GoogleIcon, name: "Google" },
    { icon: FacebookIcon, name: "Facebook" },
  ];
  */
  const inputButton = `border border-orange-900 rounded py-3 px-4 mb-4 text-base bg-black/70 text-white placeholder-gray-400`;
  const loginButton = `cursor-pointer w-full bg-yellow-300 text-black font-bold py-3 px-4 rounded hover:scale-105 hover:bg-yellow-400 text-base disabled:opacity-50`;
  // const thirdPartyButton = `flex items-center gap-2 text-sm px-4 py-2 rounded cursor-pointer hover:scale-105 bg-orange-900/40 text-white border border-orange-800`;

  return (
    <div className="flex items-center justify-center py-16 to-black px-4">
      <div className="w-1/3 max-w-3xl">
        <div>
          <div className="bg-orange-950/80 border-2 rounded-xl py-10 px-10 border-orange-900 shadow-lg">
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold">Welcome Back</h1>
              <p className="text-sm text-gray-400 mt-1">
                Sign in to access your campaign dashboard
              </p>
            </div>

            {error && <div className="text-red-400 mb-4 text-sm">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="flex flex-col mt-4">
                <input
                  type="text"
                  placeholder="Email or Username"
                  className={inputButton}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className={inputButton}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-between pb-2">
                <div>
                  <CustomCheckbox
                    id="remember"
                    checked={remember}
                    onChange={setRemember}
                    label={<span>Remember me</span>}
                  />
                </div>
                <div>
                  <a
                    href="#"
                    className="text-sm text-yellow-300 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className={loginButton}
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Log In"}
                </button>
                <button
                  type="button"
                  className={loginButton}
                  onClick={() => navigate("/register")}
                  disabled={isLoading}
                >
                  Register
                </button>
              </div>
            </form>
            {/*
            <div className="w-full flex gap-3 justify-center pt-6">
              {thirdParty.map((Item, index) => {
                const Icon = Item.icon;
                return (
                  <button
                    key={index}
                    className={thirdPartyButton}
                    title={`Sign in with ${Item.name}`}
                  >
                    <Icon className="w-6 h-6" />
                    <p className="text-sm">{Item.name}</p>
                  </button>
                );
              })}
            </div>
            */}
          </div>
        </div>
      </div>
    </div>
  );
}
