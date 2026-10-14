import React, { useState } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/react";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  // false = mobile menu is closed
  // true = mobile menu is open
  // isOpen is mainly used to track whether your mobile navigation menu is open or closed.
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      {/* Logo */}
      <Link to="/" className="max-md:flex-1">
        <img src={assets.logo} alt="logo" className="w-36 h-auto" />
      </Link>

      {/* Navigation Menu */}
      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 md:px-8 py-3 max-md:h-screen md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${
          isOpen ? "max-md:w-full" : "max-md:w-0"
        }`}
      >
        {/* X button - only visible on mobile */}
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />

        <Link to="/" onClick={() => setIsOpen(false)}>
          Home
        </Link>

        <Link to="/movies" onClick={() => setIsOpen(false)}>
          Movies
        </Link>

        <Link to="/" onClick={() => setIsOpen(false)}>
          Theaters
        </Link>

        <Link to="/" onClick={() => setIsOpen(false)}>
          Releases
        </Link>

        <Link to="/favorite" onClick={() => setIsOpen(false)}>
          Favorites
        </Link>
      </div>

      {/* Search + Login */}
      <div className="flex items-center gap-8">
        <SearchIcon className="max-md:hidden size-6 cursor-pointer" />
        {/* If the user is not logged in, it displays a Login button that opens Clerk's sign-in interface. If the user is logged in, it displays their profile button with a custom My Bookings option. Clicking that option navigates to the bookings page using React Router." */}
        {!user ? (
          <button
            className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
            onClick={openSignIn}
          >
            Login
          </button>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Bookings"
                labelIcon={<TicketPlus width={15} />}
                onClick={() => navigate("/my-bookings")}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}
      </div>

      {/* Hamburger menu - only visible on mobile */}
      <MenuIcon
        onClick={() => setIsOpen(!isOpen)}
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
      />
    </div>
  );
};

export default Navbar;
