import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { api } from "../services/api";

const Sidebar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const dashboardPaths = {
    patient: "/patient/dashboard",
    staff: "/staff/dashboard",
    admin: "/admin/dashboard",
  };

  const dashboardPath = dashboardPaths[user?.role];

  const handleLogout = async () => {
    try {
      await api("/auth/logout", {
        method: "POST",
      });

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="flex items-center justify-between bg-slate-900 px-5 py-4 md:hidden">
        <span className="text-xl font-bold text-white">
          QueueLens<span className="text-teal-400">.</span>
        </span>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm font-semibold text-white"
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "block" : "hidden"
        } min-h-screen w-full shrink-0 bg-slate-900 p-5 text-white md:sticky md:top-0 md:block md:h-screen md:w-64`}
      >
        <div className="mb-10 hidden text-2xl font-bold md:block">
          QueueLens<span className="text-teal-400">.</span>
        </div>

        <div className="mb-8 border-b border-slate-700 pb-5">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="mt-1 text-xs capitalize text-slate-400">{user?.role}</p>
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Menu
        </p>

        <nav>
          {dashboardPath && (
            <NavLink
              to={dashboardPath}
              end
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-teal-700 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="absolute bottom-5 left-5 right-5 md:fixed md:bottom-5 md:left-5 md:right-auto md:w-54">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
