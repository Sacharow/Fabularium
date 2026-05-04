import { User, Anvil, Component, UserCircle } from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 h-screen bg-neutral text-neutral-text fixed left-0 top-0 z-10000 flex flex-col justify-between gap-4 p-4">
      {/* UPPER SECTION */}
      <div className="flex flex-col gap-2">
        <NavLink
          to="/hub"
          className="text-2xl text-gold-neutral font-bold tracking-widest hover:text-gold-light"
        >
          <h1>FABULARIUM</h1>
        </NavLink>
        <div className="flex justify-between items-center">
          <button className="p-2 my-2 w-full border-2 border-gold-neutral hover:bg-gold-neutral cursor-pointer">
            <p>CREATE NEW</p>
          </button>
        </div>
        <hr />
        <div className="flex flex-col gap-2">
          <div className={buttonStyle}>
            <User />
            <p>CHARACTERS</p>
          </div>
          <div className={buttonStyle}>
            <Anvil />
            <p>CAMPAIGNS</p>
          </div>
          <div className={buttonStyle}>
            <Component />
            <p>MATERIALS</p>
          </div>
        </div>
      </div>
      {/* DOWN SECTION */}
      <div className="flex flex-col gap-2">
        <hr />
        <div className={buttonStyle}>
          <UserCircle />
          <p>PROFILE</p>
        </div>
      </div>
    </div>
  );
}

const buttonStyle =
  "w-full flex flex-row gap-2 items-center p-2 hover:bg-light hover:border-l-8 hover:border-gold-neutral cursor-pointer";

export default Sidebar;
