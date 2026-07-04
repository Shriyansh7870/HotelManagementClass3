export function Card({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-[16px] font-semibold text-gray-900">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-[12px] text-gray-400">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export function Row({ children }) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
}

export function Field({ label, ...props }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-gray-600">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] text-gray-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
      />
    </div>
  );
}

export function PwField({ label, show, onToggle, ...props }) {
  return (
    <div className="relative">
      <Field label={label} type={show ? "text" : "password"} {...props} />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-7 text-gray-400 hover:text-gray-600"
      >
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

export function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] text-gray-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 bg-white transition"
    >
      {children}
    </select>
  );
}

export function SaveBtn({ loading, children }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="rounded-lg bg-amber-500 px-5 py-2 text-[13px] font-semibold text-white hover:bg-amber-600 disabled:opacity-60 transition"
    >
      {loading ? "Saving\u2026" : children}
    </button>
  );
}

export function Alert({ ok, children }) {
  return (
    <div
      className={`rounded-lg px-3 py-2 text-[13px] ${
        ok
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-red-50 text-red-600 border border-red-200"
      }`}
    >
      {children}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    available: "bg-emerald-50 text-emerald-700 border-emerald-200",
    occupied: "bg-blue-50 text-blue-700 border-blue-200",
    maintenance: "bg-red-50 text-red-600 border-red-200",
    reserved: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize ${
        map[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

/* ─── Icons ─── */
export function BuildingIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 21h18M3 7l9-4 9 4M4 7v14M20 7v14M9 21V12h6v9" />
    </svg>
  );
}

export function BedIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
      <path d="M2 14h20" />
      <path d="M7 14v-3a1 1 0 0 1 1-1h3v4" />
      <path d="M2 20h20" />
    </svg>
  );
}

export function UsersIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function EyeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EyeOffIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
