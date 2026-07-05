import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
} from "../api/housekeeping";

const STATUS_STYLES = {
  pending: "bg-yellow-50 text-yellow-700",
  "in-progress": "bg-blue-50 text-blue-700",
  done: "bg-emerald-50 text-emerald-700",
};

const PRIORITY_STYLES = {
  low: "bg-gray-100 text-gray-500",
  normal: "bg-amber-50 text-amber-600",
  high: "bg-red-50 text-red-600",
};

const EMPTY_FORM = {
  roomNumber: "",
  taskType: "cleaning",
  assignedTo: "",
  priority: "normal",
  notes: "",
  dueDate: "",
};

export default function Housekeeping() {
  const [tasks, setTasks] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setFetching(true);
    try {
      const d = await getTasks();
      setTasks(d.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createTask(form);
      setForm(EMPTY_FORM);
      setShowForm(false);
      await fetchTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatus(id, status) {
    try {
      await updateTaskStatus(id, status);
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status } : t))
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  function formatDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const filtered = tasks.filter((t) => {
    const ms = filterStatus === "all" || t.status === filterStatus;
    const mp = filterPriority === "all" || t.priority === filterPriority;
    return ms && mp;
  });

  const counts = {
    pending: tasks.filter((t) => t.status === "pending").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.28em] text-amber-600/70">
            Operations
          </p>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Housekeeping
          </h1>
          <p className="mt-1.5 text-[14px] text-gray-400">
            Manage cleaning, maintenance and inspection tasks.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setError("");
          }}
          className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 font-mono text-[12px] font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-amber-700"
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
            <path d={showForm ? "M18 6 6 18M6 6l12 12" : "M12 5v14M5 12h14"} />
          </svg>
          {showForm ? "Close" : "Add Task"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="mb-6 flex flex-wrap gap-3">
        {Object.entries(counts).map(([s, n]) => (
          <div
            key={s}
            className={`rounded-xl border px-4 py-2 text-[12px] font-semibold ${STATUS_STYLES[s]}`}
          >
            {n} {s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}
          </div>
        ))}
      </div>

      {/* Task Form */}
      {showForm && (
        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 font-serif text-lg font-semibold text-gray-900">
            New Task
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className={labelCls}>Room Number</label>
                <input
                  name="roomNumber"
                  value={form.roomNumber}
                  onChange={handleChange}
                  required
                  placeholder="101"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Task Type</label>
                <select
                  name="taskType"
                  value={form.taskType}
                  onChange={handleChange}
                  className={inputCls}
                >
                  {["cleaning", "inspection", "maintenance", "turndown"].map(
                    (t) => (
                      <option key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div>
                <label className={labelCls}>Priority</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className={inputCls}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Assigned To</label>
                <input
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  placeholder="Staff member name"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Notes</label>
                <input
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Optional notes"
                  className={inputCls}
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm(EMPTY_FORM);
                }}
                className="rounded-lg border border-gray-200 px-5 py-2 font-mono text-[12px] uppercase tracking-wider text-gray-500 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-amber-600 px-6 py-2 font-mono text-[12px] font-semibold uppercase tracking-wider text-white hover:bg-amber-700 disabled:opacity-50"
              >
                {loading ? "Creating…" : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex gap-1">
          {["all", "pending", "in-progress", "done"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition ${
                filterStatus === s
                  ? "bg-amber-600 text-white"
                  : "border border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-mono text-[12px] text-gray-600 outline-none focus:border-amber-400"
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>
        <span className="font-mono text-[11px] text-gray-400">
          {filtered.length} task{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Tasks Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className={thCls}>Room</th>
                <th className={thCls}>Type</th>
                <th className={thCls}>Assigned To</th>
                <th className={thCls}>Priority</th>
                <th className={thCls}>Due Date</th>
                <th className={thCls}>Notes</th>
                <th className={thCls}>Status</th>
                <th className={thCls}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fetching ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-400">
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-300">
                    No tasks found.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr
                    key={t._id}
                    className="border-b border-gray-50 hover:bg-amber-50/20"
                  >
                    <td className="px-4 py-3 font-mono font-semibold text-gray-700">
                      {t.roomNumber}
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-700">
                      {t.taskType}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {t.assignedTo || (
                        <span className="text-gray-300">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase ${
                          PRIORITY_STYLES[t.priority]
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(t.dueDate)}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-gray-400">
                      {t.notes || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase ${
                          STATUS_STYLES[t.status]
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {t.status === "pending" && (
                          <button
                            onClick={() => handleStatus(t._id, "in-progress")}
                            className="rounded-lg border border-blue-200 px-2 py-1 font-mono text-[10px] uppercase text-blue-600 hover:bg-blue-50"
                          >
                            Start
                          </button>
                        )}
                        {t.status === "in-progress" && (
                          <button
                            onClick={() => handleStatus(t._id, "done")}
                            className="rounded-lg border border-emerald-200 px-2 py-1 font-mono text-[10px] uppercase text-emerald-600 hover:bg-emerald-50"
                          >
                            Done
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="rounded-lg border border-red-200 p-1.5 text-red-400 hover:bg-red-50"
                        >
                          <svg
                            width="13"
                            height="13"
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

const labelCls =
  "mb-1 block font-mono text-[11px] uppercase tracking-wider text-gray-500";
const inputCls =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] text-gray-800 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400";
const thCls =
  "px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-gray-500";
