import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  BuildingIcon,
  BedIcon,
  UsersIcon,
  LockIcon,
} from "../components/SettingsUI";
import HotelProfileTab from "../components/HotelProfileTab";
import RoomsTab from "../components/RoomTab";
import UsersTab from "../components/UserTab";
import ChangePasswordTab from "../components/ChangePasswordtab";

const TABS = [
  { key: "hotel", label: "Hotel Profile", icon: <BuildingIcon /> },
  { key: "rooms", label: "Rooms", icon: <BedIcon /> },
  { key: "users", label: "Users", icon: <UsersIcon /> },
  { key: "password", label: "Change Password", icon: <LockIcon /> },
];

export default function Settings() {
  const [tab, setTab] = useState("hotel");

  return (
    <DashboardLayout>
      {/* Page heading */}
      <div className="mb-8">
        <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.28em] text-amber-600/70">
          Configuration
        </p>
        <h1 className="font-serif text-3xl font-bold text-gray-900">
          Settings
        </h1>
        <p className="mt-1.5 text-[14px] text-gray-400">
          Manage hotel profile, rooms, users and account security.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Tab sidebar */}
        <aside className="w-48 shrink-0">
          <nav className="flex flex-col gap-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition-all ${
                  tab === t.key
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <span
                  className={tab === t.key ? "text-amber-600" : "text-gray-400"}
                >
                  {t.icon}
                </span>
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Tab content */}
        <div className="flex-1 min-w-0">
          {tab === "hotel" && <HotelProfileTab />}
          {tab === "rooms" && <RoomsTab />}
          {tab === "users" && <UsersTab />}
          {tab === "password" && <ChangePasswordTab />}
        </div>
      </div>
    </DashboardLayout>
  );
}
