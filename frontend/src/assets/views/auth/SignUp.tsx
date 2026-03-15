import { NavLink } from "react-router-dom";

const SignUp = () => {
  return (
    <div>
      {/* Hero Section */}
      <div
        className="h-[91.5vh] bg-cover bg-center relative"
        style={{
          backgroundImage: `url('/heros/forge.jpg')`,
        }}
      >
        {/* Optional overlay for text readability */}
        <div className="absolute inset-0 top-8 flex flex-col items-center gap-y-8">
          <h1 className="text-8xl font-bold text-orange-500 text-shadow-lg text-shadow-orange-950">
            FABULARIUM
          </h1>

          {/* Sign Up Form */}
          <form className="w-full max-w-2xl bg-black/60 backdrop-blur-sm border border-orange-700/50 rounded-lg p-8 shadow-2xl">
            <div className="grid grid-cols-2 gap-6">
              {/* Username Input */}
              <div className="flex flex-col gap-y-2">
                <label className="text-orange-400 font-semibold text-sm uppercase tracking-wide">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="your_username"
                  className="px-4 py-3 bg-amber-950/40 border border-orange-600/50 rounded-lg text-white placeholder-orange-800/60 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition-all"
                />
              </div>

              {/* Email Input */}
              <div className="flex flex-col gap-y-2">
                <label className="text-orange-400 font-semibold text-sm uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="px-4 py-3 bg-amber-950/40 border border-orange-600/50 rounded-lg text-white placeholder-orange-800/60 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition-all"
                />
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-y-2">
                <label className="text-orange-400 font-semibold text-sm uppercase tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="px-4 py-3 bg-amber-950/40 border border-orange-600/50 rounded-lg text-white placeholder-orange-800/60 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition-all"
                />
              </div>

              {/* Confirm Password Input */}
              <div className="flex flex-col gap-y-2">
                <label className="text-orange-400 font-semibold text-sm uppercase tracking-wide">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="px-4 py-3 bg-amber-950/40 border border-orange-600/50 rounded-lg text-white placeholder-orange-800/60 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className=" col-span-2 mt-4 w-full py-3 bg-gradient-to-r from-orange-800 to-orange-400 hover:from-orange-500 hover:to-amber-500 text-white font-bold uppercase tracking-wider rounded-lg transition-all duration-200 shadow-lg hover:shadow-orange-900/50 active:scale-95 cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          </form>

          {/* Temporary Buttons */}
          <div className="flex flex-row gap-4">
            <NavLink className="w-48 text-center" to="/reset-password">
              <p className="text-orange-300 text-shadow-lg text-shadow-orange-950 hover:text-white transition duration-300 font-bold cursor-pointer">
                Forgot Password?
              </p>
            </NavLink>
            <NavLink className="w-48 text-center" to="/contact">
              <p className="text-orange-300 text-shadow-lg text-shadow-orange-950 hover:text-white transition duration-300 font-bold cursor-pointer">
                Need Help?
              </p>
            </NavLink>
            <NavLink className="w-48 text-center" to="/sign-in">
              <p className="text-orange-300 text-shadow-lg text-shadow-orange-950 hover:text-white transition duration-300 font-bold cursor-pointer">
                Log In
              </p>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
