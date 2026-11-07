import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiGrid,
  FiCalendar,
  FiClipboard,
  FiUsers,
  FiBriefcase,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

function Sidebar() {
  const { user, logout } = useAuth();

  const role = user?.role;

  const menuItems = {
    patient: [
      { name: "Dashboard", path: "/patient/dashboard", icon: FiGrid },
      { name: "Book Appointment", path: "/patient/book", icon: FiCalendar },
      {
        name: "My Appointments",
        path: "/patient/appointments",
        icon: FiClipboard,
      },
      { name: "Profile", path: "/patient/profile", icon: FiUser },
    ],

    staff: [
      { name: "Dashboard", path: "/staff/dashboard", icon: FiGrid },
      { name: "Queue", path: "/staff/queue", icon: FiClipboard },
      { name: "Profile", path: "/staff/profile", icon: FiUser },
    ],

    admin: [
      { name: "Dashboard", path: "/admin/dashboard", icon: FiGrid },
      { name: "Services", path: "/admin/services", icon: FiBriefcase },
      { name: "Staff", path: "/admin/staff", icon: FiUsers },
      { name: "Applications", path: "/admin/applications", icon: FiClipboard },
    ],
  };

  const items = menuItems[role] || [];

  return (
    <aside className="flex h-screen w-64 flex-col bg-slate-900 text-white">
      <div className="border-b border-slate-700 p-6">
        <h1 className="text-2xl font-bold text-teal-400">QueueLens</h1>
        <p className="mt-1 text-sm text-slate-400">Queue Management</p>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-teal-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-700 p-4">
        <p className="mb-3 truncate px-2 text-sm text-slate-400">
          {user?.name || "User"}
        </p>

        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-red-400"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
