import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <div className="flex flex-col items-center my-8">
      <div className="flex flex-row justify-between gap-16 mb-4">
        <NavLink
          to="/Contact"
          className="text-sm text-orange-600 hover:underline hover:text-orange-500 min-w-32 text-center"
        >
          Contact
        </NavLink>
        <NavLink
          to="/Privacy"
          className="text-sm text-orange-600 hover:underline hover:text-orange-500 min-w-32 text-center"
        >
          Privacy Policy
        </NavLink>
        <NavLink
          to="/Terms"
          className="text-sm text-orange-600 hover:underline hover:text-orange-500 min-w-32 text-center"
        >
          Terms of Service
        </NavLink>
      </div>
      <p className="text-sm text-orange-600 hover:text-orange-400">
        @2026 Fabularium. All Rights reserved.
      </p>
    </div>
  );
}

export default Footer;
