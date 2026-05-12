import { useState } from "react";
import { z } from "zod";
import { Mail, Eye, EyeOff } from "lucide-react";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const signInSchema = z.object({
  email: z.email().min(1, "Email is required").max(255, "Email is too long"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(255, { message: "Password is too long" }),
});

const SignIn = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, login, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();

    const result = signInSchema.safeParse(formData);

    if (!result.success) {
      const flattenedErrors = result.error.flatten().fieldErrors;

      setFieldErrors({
        email: flattenedErrors.email?.[0],
        password: flattenedErrors.password?.[0],
      });

      return;
    }

    try {
      await login({ email: formData.email, password: formData.password });
      setFieldErrors({});
      navigate("/profile", { replace: true });
    } catch {
      // Error is surfaced from auth context.
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen ml-64 bg-dark flex items-center justify-center px-6 text-gray-light">
        Loading your session...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="h-screen ml-64 bg-dark flex items-center justify-center px-6">
      <div className="w-full max-w-md border-2 border-gold-neutral bg-neutral py-20 px-12">
        <h1 className="text-4xl font-bold text-gold-neutral text-center tracking-wider">
          Fabularium
        </h1>
        <h2 className="text-xl text-center font-bold text-gray-light tracking-wide">
          Tabletop Management App
        </h2>
        <div className="flex flex-col gap-8">
          <form
            className="mt-10 flex flex-col gap-8 px-6"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-md font-bold tracking-wider text-gray-light">
                Username or Email
              </label>
              <div className="flex items-center gap-3 border-b-2 border-b-gold-neutral pb-2">
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="flex-1 bg-transparent text-sm text-gray-light placeholder-gray-neutral focus:outline-none"
                />
                <Mail size={18} className="text-gray-neutral" />
              </div>
              {fieldErrors.email ? (
                <p className="text-sm text-error">{fieldErrors.email}</p>
              ) : null}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label className="text-md font-bold tracking-wider text-gray-light">
                Password
              </label>
              <div className="flex items-center gap-3 border-b-2 border-b-gold-neutral pb-2">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    showPassword ? "*********" : "Enter your password"
                  }
                  value={formData.password}
                  onChange={handleChange}
                  className="flex-1 bg-transparent text-sm text-gray-light placeholder-gray-neutral focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-neutral hover:text-gray-light cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <NavLink
                to="/reset-password"
                className="text-sm text-gold-light hover:text-gold-neutral cursor-pointer"
              >
                Forgot your password?
              </NavLink>
              {fieldErrors.password ? (
                <p className="text-sm text-error">{fieldErrors.password}</p>
              ) : null}
            </div>
            <button
              type="submit"
              className="w-full border-2 border-gold-neutral bg-dark py-4 text-md text-text-neutral font-medium hover:bg-gold-neutral cursor-pointer"
            >
              SIGN IN
            </button>
            {error ? (
              <p className="text-sm text-error text-center">{error}</p>
            ) : null}

            <hr className="text-gold-neutral" />
          </form>
          <div className="flex flex-col gap-4 justify-between items-center ">
            <h1 className="text-md text-gold-light">Don't have an account?</h1>
            <NavLink
              to="/sign-up"
              className="w-full text-md font-bold text-gold-neutral hover:text-gold-light cursor-pointer"
            >
              <p className="text-center">CREATE AN ACCOUNT</p>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
