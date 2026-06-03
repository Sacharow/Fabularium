import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <div className="px-8 py-10 text-neutral-text">
      <div className="mb-6 flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:gap-12">
        <NavLink
          to="/contact"
          className="text-sm text-gold-neutral hover:text-gold-light uppercase tracking-wide"
        >
          Contact
        </NavLink>
        <NavLink
          to="/privacy"
          className="text-sm text-gold-neutral hover:text-gold-light uppercase tracking-wide"
        >
          Privacy Policy
        </NavLink>
        <NavLink
          to="/terms"
          className="text-sm text-gold-neutral hover:text-gold-light uppercase tracking-wide"
        >
          Terms of Service
        </NavLink>
      </div>
      <p className="text-sm text-neutral-text text-center">
        @2026 Fabularium. All Rights reserved.
      </p>
    </div>
  );
}

export default Footer;
