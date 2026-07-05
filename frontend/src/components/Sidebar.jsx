import { NavLink } from "react-router-dom";

const NAV = [
  { label: "Dashboard", to: "/dashboard", icon: "🏠" },
  { label: "Check-In", to: "/check-in", icon: "🧳" },
  { label: "Housekeeping", to: "/housekeeping", icon: "🧹" },
  { label: "Settings", to: "/settings", icon: "⚙️" },
];

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 bg-gray-900 p-3 text-gray-300">
      <nav className="flex flex-col gap-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[15px] transition ${
                isActive
                  ? "bg-white/10 text-white"
                  : "hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
