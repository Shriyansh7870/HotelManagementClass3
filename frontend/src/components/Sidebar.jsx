import { useState } from "react";
import { NavLink } from "react-router-dom";

const NAV = [
  { label: "Dashboard", to: "/dashboard", icon: "🏠" },
  { label: "Check-In", to: "/check-in", icon: "🧳" },
  { label: "Housekeeping", to: "/housekeeping", icon: "🧹" },
  { label: "Settings", to: "/settings", icon: "⚙️" },
  { label: "Food Orders", to: "/food-orders", icon: "🍽️" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-56"
      } shrink-0 bg-gray-900 p-3 text-gray-300 transition-all duration-200`}
    >
      <button
        type="button"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="mb-2 flex w-full items-center justify-center rounded-lg px-3 py-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
      >
        {collapsed ? "»" : "«"}
      </button>
      <nav className="flex flex-col gap-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[15px] transition ${
                collapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "bg-white/10 text-white"
                  : "hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <span>{item.icon}</span>
            {!collapsed && item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
