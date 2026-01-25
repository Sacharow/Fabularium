import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CustomCheckbox from "../components/ui/CustomCheckbox";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

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
      navigate("/login");
    } catch (err) {
      console.error("Registration failed", err);
    }
  };

  const inputClass =
    "border border-orange-900 rounded py-3 px-4 mb-4 text-base bg-black/70 text-white placeholder-gray-400";
  const primaryButton =
    "cursor-pointer w-full bg-yellow-300 text-black font-bold py-3 px-4 rounded hover:scale-105 hover:bg-yellow-400 text-base disabled:opacity-50";

  return (
    <div className="flex items-center justify-center py-20 px-4">
      <div className="w-1/3 max-w-3xl">
        <div className="bg-orange-950/80 border-2 rounded-xl py-10 px-10 border-orange-900 shadow-lg">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-sm text-gray-400 mt-1">
              Choose a username and secure password to get started.
            </p>
          </div>

          {error && <div className="text-red-400 mb-4 text-sm">{error}</div>}

          <form onSubmit={handleRegister}>
            <div className="flex flex-col mt-4">
              <input
                type="text"
                placeholder="Choose a username"
                className={inputClass}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Enter your email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Create a password"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Repeat your password"
                className={inputClass}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-between pb-2 items-center">
              <CustomCheckbox
                id="remember"
                checked={remember}
                onChange={setRemember}
                label={<span>Remember me</span>}
              />
              <button
                type="button"
                className="text-sm text-yellow-300 hover:underline"
                onClick={() => navigate("/login")}
              >
                Already have an account?
              </button>
            </div>

            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className={primaryButton}
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
              <button
                type="button"
                className={primaryButton}
                onClick={() => navigate("/login")}
                disabled={isLoading}
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
