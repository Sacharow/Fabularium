import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <div className="flex flex-col items-center my-8">
      <div className="flex flex-row justify-between gap-16 mb-4">
        <NavLink
          to="/About"
          className="text-sm text-orange-600 hover:underline hover:text-orange-500"
        >
          About Us
        </NavLink>
        <NavLink
          to="/Contact"
          className="text-sm text-orange-600 hover:underline hover:text-orange-500"
        >
          Contact
        </NavLink>
        <NavLink
          to="/Privacy"
          className="text-sm text-orange-600 hover:underline hover:text-orange-500"
        >
          Privacy Policy
        </NavLink>
        <NavLink
          to="/Terms"
          className="text-sm text-orange-600 hover:underline hover:text-orange-500"
        >
          Terms of Service
        </NavLink>
      </div>
      <p className="text-sm text-orange-600 hover:text-orange-400">
        @2026 Fabularium. No Rights reserved.
      </p>
    </div>
  );
}

export default Footer;
