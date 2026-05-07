import { useState } from "react";
import { z } from "zod";
import { Mail, User, Eye, EyeOff } from "lucide-react";
import { NavLink } from "react-router-dom";

const signUpSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .max(255, "Username is too long"),
    email: z.email().min(1, "Email is required").max(255, "Email is too long"),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(255, { message: "Password is too long" }),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = signUpSchema.safeParse(formData);

    if (!result.success) {
      const flattenedErrors = result.error.flatten().fieldErrors;

      setFieldErrors({
        username: flattenedErrors.username?.[0],
        email: flattenedErrors.email?.[0],
        password: flattenedErrors.password?.[0],
        confirmPassword: flattenedErrors.confirmPassword?.[0],
      });

      return;
    }

    setFieldErrors({});
  };

  return (
    <div className="h-screen ml-64 bg-dark flex items-center justify-center px-6">
      <div className="w-full max-w-3xl border-2 border-gold-neutral bg-neutral p-10 md:p-14">
        <div className="flex flex-col gap-8">
          <div className="space-y-2 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gold-neutral tracking-wider">
              Fabularium
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-gray-light tracking-wide">
              Tabletop Management App
            </h2>
          </div>

          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2 md:col-span-1">
                <label className="text-md font-bold tracking-wider text-gray-light">
                  Username
                </label>
                <div className="flex items-center gap-3 border-b-2 border-b-gold-neutral pb-2">
                  <input
                    name="username"
                    type="text"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    className="flex-1 bg-transparent text-sm text-gray-light placeholder-gray-neutral focus:outline-none"
                  />
                  <User size={18} className="text-gray-neutral" />
                </div>
                {fieldErrors.username ? (
                  <p className="text-sm text-error">{fieldErrors.username}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2 md:col-span-1">
                <label className="text-md font-bold tracking-wider text-gray-light">
                  Email
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

              <div className="flex flex-col gap-2 md:col-span-1">
                <label className="text-md font-bold tracking-wider text-gray-light">
                  Password
                </label>
                <div className="flex items-center gap-3 border-b-2 border-b-gold-neutral pb-2">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      showPassword ? "*********" : "Create a password"
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
                {fieldErrors.password ? (
                  <p className="text-sm text-error">{fieldErrors.password}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2 md:col-span-1">
                <label className="text-md font-bold tracking-wider text-gray-light">
                  Confirm Password
                </label>
                <div className="flex items-center gap-3 border-b-2 border-b-gold-neutral pb-2">
                  <input
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      showPassword ? "*********" : "Confirm your password"
                    }
                    value={formData.confirmPassword}
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
                {fieldErrors.confirmPassword ? (
                  <p className="text-sm text-error">
                    {fieldErrors.confirmPassword}
                  </p>
                ) : null}
              </div>
            </div>

            <button
              type="submit"
              className="w-full border-2 border-gold-neutral bg-dark py-4 text-md text-text-neutral font-medium hover:bg-gold-neutral cursor-pointer"
            >
              SIGN UP
            </button>
          </form>

          <hr className="text-gold-neutral" />

          <div className="flex flex-col gap-4 items-center">
            <h1 className="text-md text-gold-light">
              Already have an account?
            </h1>
            <NavLink
              to="/sign-in"
              className="w-full text-md font-bold text-gold-neutral hover:text-gold-light cursor-pointer"
            >
              <p className="text-center">GO TO SIGN IN</p>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
