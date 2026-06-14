import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getCheckins,
  createCheckin,
  deleteCheckin,
  checkoutGuest,
} from "../api";

const EMPTY_FORM = {
  guestName: "",
  email: "",
  phone: "",
  roomNumber: "",
  checkInDate: "",
  checkOutDate: "",
  numberOfGuests: "",
  idProof: "",
  idProofNumber: "",
  status: "booked",
};
const ID_PROOF_LABELS = {
  passport: "Passport",
  nationalId: "National ID",
  driverLicense: "Driver License",
};

export default function CheckIn() {
  const [checkins, setCheckins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  // Fetch all check-ins on mount
  useEffect(() => {
    fetchCheckins();
  }, []);

  async function fetchCheckins() {
    setFetching(true);
    try {
      const data = await getCheckins();
      setCheckins(data.checkins || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createCheckin({
        ...form,
        numberOfGuests: Number(form.numberOfGuests),
      });
      setForm(EMPTY_FORM);
      setShowForm(false);
      await fetchCheckins();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      await deleteCheckin(id);
      await fetchCheckins();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCheckout(id) {
    try {
      await checkoutGuest(id);
      await fetchCheckins();
    } catch (err) {
      setError(err.message);
    }
  }

  function formatDate(d) {
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.28em] text-amber-600/70">
            Check-In
          </p>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Guest Check-In
          </h1>
          <p className="mt-1.5 text-[14px] text-gray-400">
            Register guests and manage check-in records.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setError("");
          }}
          className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 font-mono text-[12px] font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-amber-700"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          {showForm ? "Close Form" : "New Check-In"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
          {error}
        </div>
      )}

      {/* Check-in Form */}
      {showForm && (
        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 font-serif text-lg font-semibold text-gray-900">
            Register New Guest
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Guest Name */}
              <div>
                <label className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-gray-500">
                  Guest Name
                </label>
                <input
                  type="text"
                  name="guestName"
                  value={form.guestName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[14px] text-gray-800 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  placeholder="John Doe"
                />
              </div>
              {/* Email */}
              <div>
                <label className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-gray-500">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[14px] text-gray-800 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  placeholder="john@example.com"
                />
              </div>
              {/* Phone */}
              <div>
                <label className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-gray-500">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[14px] text-gray-800 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  placeholder="+1 234 567 890"
                />
              </div>
              {/* Room Number */}
              <div>
                <label className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-gray-500">
                  Room Number
                </label>
                <input
                  type="text"
                  name="roomNumber"
                  value={form.roomNumber}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[14px] text-gray-800 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  placeholder="101"
                />
              </div>
              {/* Number of Guests */}
              <div>
                <label className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-gray-500">
                  Number of Guests
                </label>
                <input
                  type="number"
                  name="numberOfGuests"
                  value={form.numberOfGuests}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[14px] text-gray-800 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
              {/* ID Proof Type */}
              <div>
                <label className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-gray-500">
                  ID Proof Type
                </label>
                <select
                  name="idProof"
                  value={form.idProof}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[14px] text-gray-800 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                >
                  <option value="nationalId">National ID</option>
                  <option value="passport">Passport</option>
                  <option value="driverLicense">Driver License</option>
                </select>
              </div>
              {/* ID Number */}
              <div>
                <label className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-gray-500">
                  ID Number
                </label>
                <input
                  type="text"
                  name="idProofNumber"
                  value={form.idProofNumber}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[14px] text-gray-800 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  placeholder="AB1234567"
                />
              </div>
              {/* Check-in Date */}
              <div>
                <label className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-gray-500">
                  Check-In Date
                </label>
                <input
                  type="date"
                  name="checkInDate"
                  value={form.checkInDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[14px] text-gray-800 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
              {/* Check-out Date */}
              <div>
                <label className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-gray-500">
                  Check-Out Date
                </label>
                <input
                  type="date"
                  name="checkOutDate"
                  value={form.checkOutDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[14px] text-gray-800 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>
            {/* Submit */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm(EMPTY_FORM);
                  setError("");
                }}
                className="mr-3 rounded-lg border border-gray-200 px-5 py-2 font-mono text-[12px] uppercase tracking-wider text-gray-500 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-amber-600 px-6 py-2 font-mono text-[12px] font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-amber-700 disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register Check-In"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-gray-500">
                  Guest
                </th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-gray-500">
                  Room
                </th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-gray-500">
                  Phone
                </th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-gray-500">
                  Check-In
                </th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-gray-500">
                  Check-Out
                </th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-gray-500">
                  ID Proof
                </th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {fetching ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-12 text-center text-gray-400"
                  >
                    Loading records...
                  </td>
                </tr>
              ) : checkins.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-12 text-center text-gray-300"
                  >
                    No check-in records yet. Click &quot;New Check-In&quot; to
                    register a guest.
                  </td>
                </tr>
              ) : (
                checkins.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b border-gray-50 transition hover:bg-amber-50/30"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {c.guestName}
                      </div>
                      <div className="text-[12px] text-gray-400">{c.email}</div>
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-gray-700">
                      {c.roomNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{c.phone}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(c.checkInDate)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(c.checkOutDate)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-600">
                        {ID_PROOF_LABELS[c.idProof] || c.idProof}
                      </span>
                      <span className="ml-1 text-[12px] text-gray-400">
                        ({c.idProofNumber})
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase ${
                          c.status === "checked-in"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {c.status === "checked-in" && (
                          <button
                            onClick={() => handleCheckout(c._id)}
                            title="Check Out"
                            className="rounded-lg border border-amber-200 px-2.5 py-1 font-mono text-[11px] uppercase text-amber-600 transition hover:bg-amber-50"
                          >
                            Check Out
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(c._id)}
                          title="Delete"
                          className="rounded-lg border border-red-200 p-1.5 text-red-400 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
