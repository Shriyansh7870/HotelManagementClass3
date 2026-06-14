import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../api";
import { saveAuth } from "../utils/auth";

const FEATURES = [
  "Reservations",
  "Front Desk",
  "Rooms & Rates",
  "Housekeeping",
  "Billing",
  "Guest Services",
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@forgequantum.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login({ email, password });
      saveAuth({ token: data.token, user: data.user });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative grid min-h-screen items-center bg-cover bg-center bg-fixed lg:grid-cols-2">
      {/* Banner background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/banner.jpg')" }}
      />
      {/* Readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />

      {/* ---------- Left: marketing intro ---------- */}
      <section className="relative z-10 px-8 py-16 text-white sm:px-12 lg:px-24">
        <p className="mb-7 flex items-center gap-2.5 font-mono text-[13px] uppercase tracking-[0.32em] text-gold-light">
          <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_12px_var(--color-gold)]" />
          Hotel Management System
        </p>

        <h1 className="mb-7 font-serif text-5xl font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
          Exceptional Stays.
          <br />
          <em className="italic text-gold-light">Effortless Management.</em>
        </h1>

        <p className="mb-9 max-w-xl text-[17px] leading-relaxed text-white/70">
          An all-in-one platform to run your hotel — manage reservations, front
          desk, rooms, housekeeping, billing and guest services, unified in a
          single dashboard.
        </p>

        <ul className="flex flex-wrap gap-3.5">
          {FEATURES.map((feature) => (
            <li
              key={feature}
              className="rounded-full border border-gold/50 bg-gold/[0.06] px-5 py-2 text-sm text-gold-light transition hover:-translate-y-0.5 hover:bg-gold/15"
            >
              {feature}
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Right: sign-in card ---------- */}
      <section className="relative z-10 flex justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="flex w-full max-w-md flex-col rounded-2xl border border-white/15 bg-white/[0.06] p-10 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          {/* Brand */}
          <div className="mb-7 flex flex-col items-center text-center">
            <img
              src="/favicon.svg"
              alt="Hotel Management System"
              className="mb-3 h-14 w-14"
            />
            <h2 className="mt-1.5 font-serif text-3xl font-bold text-white">
              Hotel <span className="italic text-gold-light">Management</span>
            </h2>
          </div>

          {/* Card head */}
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-white">
              Sign In
            </h3>
            <span className="flex items-center gap-1.5 font-mono text-xs text-green-400">
              <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]" />
              System Online
            </span>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-400/50 bg-red-600/15 px-3.5 py-2.5 text-[13px] text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* Email */}
            <label className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/70">
              Email Address
            </label>
            <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-white/15 bg-black/25 px-3.5 transition focus-within:border-gold focus-within:bg-black/35">
              <MailIcon />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="flex-1 bg-transparent py-3 text-[15px] text-white outline-none placeholder:text-white/40"
                placeholder="you@company.com"
              />
            </div>

            {/* Password */}
            <label className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/70">
              Password
            </label>
            <div className="mb-6 flex items-center gap-2.5 rounded-lg border border-white/15 bg-black/25 px-3.5 transition focus-within:border-gold focus-within:bg-black/35">
              <LockIcon />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="flex-1 bg-transparent py-3 text-[15px] text-white outline-none placeholder:text-white/40"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="flex text-white/45 transition hover:text-gold-light"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-lg bg-gradient-to-br from-gold-light to-gold py-3.5 font-mono text-sm font-semibold uppercase tracking-[0.18em] text-[#1a160c] transition hover:brightness-105 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-65"
            >
              {loading ? "Signing In…" : "Sign In"}
            </button>
          </form>
          <p className="mt-6 text-center font-mono text-[13px] text-white/50">
            Dont have Account ?.{" "}
            <Link
              to="/register"
              className="text-gold underline-offset-2 hover:underline"
            >
              Create One
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

/* ---------- Inline icons ---------- */
function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white/45"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white/45"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function EyeIcon({ open }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {open ? (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c6.5 0 10 8 10 8a18 18 0 0 1-2.16 3.19M6.6 6.6A18 18 0 0 0 2 12s3.5 7 10 7a9.1 9.1 0 0 0 5.4-1.6" />
          <path d="m2 2 20 20" />
        </>
      )}
    </svg>
  );
}
