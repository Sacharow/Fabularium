import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GoogleIcon } from "../components/ui/GoogleIcon";
import { FacebookIcon } from "../components/ui/FacebookIcon";
import CustomCheckbox from "../components/ui/CustomCheckbox";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [remember, setRemember] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const { login, register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      const credentials = username ? { name: username, password } : { email, password };
      await login(credentials);
      navigate("/campaigns");
    } catch (err) {
      console.error("Login failed");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      await register({ name: username, email, password });
      alert("Registration successful! Please log in.");
      setIsRegistering(false);
    } catch (err) {
      console.log(err);
      console.error("Registration failed");
    }
  };

  const thirdParty = [
    { icon: GoogleIcon, name: "Google" },
    { icon: FacebookIcon, name: "Facebook" }
  ];

  const inputButton = `border border-orange-900 rounded py-2 px-4 mb-4 text-sm bg-black/70 text-white placeholder-gray-400`;
  const loginButton = `cursor-pointer w-full bg-yellow-300 text-black font-bold py-2 px-4 rounded hover:scale-105 hover:bg-yellow-400 text-sm disabled:opacity-50`;
  const thirdPartyButton = `flex items-center gap-2 text-sm px-4 py-2 rounded cursor-pointer hover:scale-105 bg-orange-900/40 text-white border border-orange-800`;

  return (
    <div className="flex items-center justify-center py-8 to-black px-4">
      <div className="w-1/3 max-w-2xl">
        <div>
          <div className="bg-orange-950/80 border-2 rounded-xl py-6 px-8 border-orange-900 shadow-lg">
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold">{isRegistering ? 'Create Account' : 'Welcome Back'}</h1>
              <p className="text-sm text-gray-400 mt-1">
                {isRegistering ? 'Choose a username and secure password' : 'Sign in to access your campaign dashboard'}
              </p>
            </div>

            {error && <div className="text-red-400 mb-4 text-sm">{error}</div>}

            {!isRegistering && (
              <form onSubmit={handleLogin}>
                <div className="flex flex-col mt-4">
                  <input
                    type="text"
                    placeholder="Email or Username"
                    className={inputButton}
                    value={username || email}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setEmail(e.target.value);
                    }}
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
                    <CustomCheckbox id="remember" checked={remember} onChange={setRemember} label={<span>Remember me</span>} />
                  </div>
                  <div>
                    <a href="#" className="text-sm text-yellow-300 hover:underline">Forgot password?</a>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button type="submit" className={loginButton} disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Log In'}
                  </button>
                  <button
                    type="button"
                    className={loginButton}
                    onClick={() => {
                      setIsRegistering(true);
                      clearError();
                    }}
                    disabled={isLoading}
                  >
                    Register
                  </button>
                </div>
              </form>
            )}

            {isRegistering && (
              <form onSubmit={handleRegister}>
                <div className="flex flex-col mt-4">
                  <input
                    type="text"
                    placeholder="Choose a username"
                    className={inputButton}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={inputButton}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Create a password"
                    className={inputButton}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Repeat your password"
                    className={inputButton}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button type="submit" className={loginButton} disabled={isLoading}>
                    {isLoading ? 'Registering...' : 'Register'}
                  </button>
                  <button
                    type="button"
                    className={loginButton}
                    onClick={() => {
                      setIsRegistering(false);
                      clearError();
                    }}
                    disabled={isLoading}
                  >
                    Back
                  </button>
                </div>
              </form>
            )}

            <div className="w-full flex gap-3 justify-center pt-6">
              {thirdParty.map((Item, index) => {
                const Icon = Item.icon;
                return (
                  <button key={index} className={thirdPartyButton} title={`Sign in with ${Item.name}`}>
                    <Icon className="w-6 h-6" />
                    <p className="text-sm">{Item.name}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}