import { NavLink } from "react-router-dom";

const ResetPassword = () => {
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

          {/* Reset Password Form */}
          <form className="w-96 bg-black/60 backdrop-blur-sm border border-orange-700/50 rounded-lg p-8 shadow-2xl">
            <div className="flex flex-col gap-y-6">
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

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-4 w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold uppercase tracking-wider rounded-lg transition-all duration-200 shadow-lg hover:shadow-orange-900/50 active:scale-95 cursor-pointer"
              >
                Reset Password
              </button>
            </div>
          </form>

          {/* Temporary Buttons */}
          <div className="flex flex-row gap-4 bg-black/40 backdrop-blur-md border border-orange-700/30 rounded-lg p-2">
            <NavLink className="w-48 text-center" to="/contact">
              <p className="text-orange-300 text-shadow-lg text-shadow-orange-950 hover:text-white transition duration-300 font-bold cursor-pointer">
                Need Help?
              </p>
            </NavLink>
            <NavLink className="w-48 text-center" to="/sign-in">
              <p className="text-orange-300 text-shadow-lg text-shadow-orange-950 hover:text-white transition duration-300 font-bold cursor-pointer">
                Sign In
              </p>
            </NavLink>
            <NavLink className="w-48 text-center" to="/sign-up">
              <p className="text-orange-300 text-shadow-lg text-shadow-orange-950 hover:text-white transition duration-300 font-bold cursor-pointer">
                Sign Up
              </p>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
