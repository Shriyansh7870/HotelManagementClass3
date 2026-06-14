import { Link } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import { getUser } from "../utils/auth";

const STATS = [
  { label: "Available Rooms", value: "42", icon: "🛏️" },
  { label: "Today's Check-ins", value: "18", icon: "🧳" },
  { label: "Occupancy", value: "76%", icon: "📊" },
  { label: "Revenue (Today)", value: "$12.4k", icon: "💰" },
];

export default function Dashboard() {
  const user = getUser();

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back{user?.name ? `, ${user.name}` : ""} 👋
          </h1>
          <p className="text-gray-500">Here's what's happening at your hotel today.</p>
        </div>
        <Link
          to="/check-in"
          className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          + New Check-In
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5"
          >
            <span className="text-3xl">{stat.icon}</span>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-[13px] text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
