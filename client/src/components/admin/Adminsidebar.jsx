import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";
import {
  LayoutDashboardIcon,
  ListCollapseIcon,
  ListIcon,
  PlusSquareIcon,
} from "lucide-react";

const Adminsidebar = () => {
  const user = {
    firstName: "John",
    lastName: "Doe",
    imageUrl: assets.profile,
  };

  const adminNavlinks = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboardIcon },
    { name: "Add Shows", path: "/admin/add-shows", icon: PlusSquareIcon },
    { name: "List Shows", path: "/admin/list-shows", icon: ListIcon },
    // {
    //   name: "List Bookings",
    //   path: "/admin/list-bookings",
    //   icon: ListCollapseIcon,
    // },
  ];

  return (
    <div>
      <img
        src={user.imageUrl}
        alt="Profile"
        className="w-16 h-16 rounded-full"
      />

      <p>
        {user.firstName} {user.lastName}
      </p>

      <div className="w-full">
        {adminNavlinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end
            className={({ isActive }) =>
              `relative flex items-center max-md:justify-center gap-2 w-full py-2.5 min-md:pl-10 first:mt-6 text-gray-400 ${
                isActive ? "bg-primary/15 text-primary group" : ""
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className="w-5 h-5" />

                <p className="max-md:hidden">{link.name}</p>

                <span
                  className={`w-1.5 h-10 rounded-l right-0 absolute ${
                    isActive ? "bg-primary" : ""
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Adminsidebar;