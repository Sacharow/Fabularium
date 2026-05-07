import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import React from "react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "code" | "password">("email");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const stepTitle =
    step === "email"
      ? "Reset Password"
      : step === "code"
        ? "Verify Code"
        : "New Password";

  const fieldShellClass =
    "flex items-center gap-3 border-b-2 border-b-gold-neutral pb-2";
  const inputClass =
    "flex-1 bg-transparent text-sm text-gray-light placeholder-gray-neutral focus:outline-none";
  const actionButtonClass =
    "w-full border-2 border-gold-neutral bg-neutral py-4 text-md font-medium text-text-neutral hover:bg-gold-neutral cursor-pointer";

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // TODO: Implement password reset request API call
      // const response = await fetch(`${API_URL}/api/users/request-password-reset`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email }),
      // });
      // if (!response.ok) throw new Error("Failed to send reset email");

      setSuccess("Check your email for reset instructions");
      setTimeout(() => setStep("code"), 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send reset email",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // TODO: Implement code verification API call
      setSuccess("Code verified. Set your new password.");
      setTimeout(() => setStep("password"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid reset code");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // TODO: Implement password reset API call
      // const response = await fetch(`${API_URL}/api/users/reset-password`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, code, password: newPassword }),
      // });
      // if (!response.ok) throw new Error("Failed to reset password");

      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/sign-in"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen ml-64 bg-dark px-6 py-10 lg:px-10">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-center">
        <div className="w-full max-w-2xl border-2 border-gold-neutral bg-neutral p-6 md:p-10">
          <header className="flex flex-col gap-4 border-b border-gold-dark pb-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold-light">
                Account Recovery
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-widest text-neutral-text md:text-3xl">
                FABULARIUM
              </h1>
            </div>

            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-widest text-gray-light">
              <span
                className={`border border-gold-dark px-3 py-2 ${step === "email" ? "bg-dark text-gold-light" : "bg-transparent"}`}
              >
                Email
              </span>
              <span
                className={`border border-gold-dark px-3 py-2 ${step === "code" ? "bg-dark text-gold-light" : "bg-transparent"}`}
              >
                Code
              </span>
              <span
                className={`border border-gold-dark px-3 py-2 ${step === "password" ? "bg-dark text-gold-light" : "bg-transparent"}`}
              >
                Password
              </span>
            </div>
          </header>

          <div className="mt-6 border-2 border-gold-dark bg-dark p-5 md:p-6">
            <div className="flex items-start justify-between gap-4 border-b border-gold-dark pb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-light">
                  Reset Flow
                </p>
                <h2 className="mt-2 text-xl font-semibold text-neutral-text">
                  {stepTitle}
                </h2>
              </div>
              <p className="text-xs uppercase tracking-widest text-gold-light">
                Step {step === "email" ? "01" : step === "code" ? "02" : "03"}
              </p>
            </div>

            {error ? (
              <div className="mt-5 border border-error bg-dark px-4 py-3 text-sm text-error">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="mt-5 border border-gold-dark bg-neutral px-4 py-3 text-sm text-gold-light">
                {success}
              </div>
            ) : null}

            <div className="mt-6">
              <p className="text-xs uppercase tracking-widest text-gold-light">
                {step === "email"
                  ? "Enter your account email"
                  : step === "code"
                    ? "Check your inbox and paste the verification code"
                    : "Create a new password and confirm it"}
              </p>

              {/* Email Step */}
              {step === "email" && (
                <form
                  onSubmit={handleEmailSubmit}
                  className="mt-6 flex flex-col gap-6"
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-gray-light">
                      Email Address
                    </label>
                    <div className={fieldShellClass}>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={actionButtonClass}
                  >
                    {loading ? "SENDING..." : "SEND RESET CODE"}
                  </button>
                </form>
              )}

              {/* Code Step */}
              {step === "code" && (
                <form
                  onSubmit={handleCodeSubmit}
                  className="mt-6 flex flex-col gap-6"
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-gray-light">
                      Verification Code
                    </label>
                    <div className={fieldShellClass}>
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="ENTER CODE"
                        required
                        maxLength={6}
                        className={`${inputClass} text-center tracking-[0.35em]`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={actionButtonClass}
                  >
                    {loading ? "VERIFYING..." : "VERIFY CODE"}
                  </button>
                </form>
              )}

              {/* Password Step */}
              {step === "password" && (
                <form
                  onSubmit={handlePasswordSubmit}
                  className="mt-6 flex flex-col gap-6"
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-gray-light">
                      New Password
                    </label>
                    <div className={fieldShellClass}>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-gray-light">
                      Confirm Password
                    </label>
                    <div className={fieldShellClass}>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={actionButtonClass}
                  >
                    {loading ? "RESETTING..." : "RESET PASSWORD"}
                  </button>
                </form>
              )}
            </div>

            <div className="mt-8 border-t border-gold-dark pt-6">
              <div className="grid gap-3 text-sm md:grid-cols-3">
                <NavLink
                  to="/sign-in"
                  className="border border-gold-dark bg-neutral px-4 py-3 text-center text-text-neutral hover:bg-gold-neutral cursor-pointer"
                >
                  BACK TO SIGN IN
                </NavLink>
                <NavLink
                  to="/sign-up"
                  className="border border-gold-dark bg-neutral px-4 py-3 text-center text-text-neutral hover:bg-gold-neutral cursor-pointer"
                >
                  CREATE ACCOUNT
                </NavLink>
                <NavLink
                  to="/contact"
                  className="border border-gold-dark bg-neutral px-4 py-3 text-center text-text-neutral hover:bg-gold-neutral cursor-pointer"
                >
                  NEED HELP?
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
