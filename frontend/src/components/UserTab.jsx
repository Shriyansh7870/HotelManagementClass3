import { useEffect, useState } from "react";
import { getUsers, addUser } from "../api/settings";
import {
  Alert,
  Card,
  EyeIcon,
  EyeOffIcon,
  Field,
  Row,
  SaveBtn,
  Select,
  Spinner,
} from "./SettingsUI";

export default function UsersTab() {
  const emptyForm = { name: "", email: "", password: "", role: "user" };
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [showPw, setShowPw] = useState(false);

  const load = () =>
    getUsers()
      .then((r) => setUsers(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await addUser(form);
      setMsg({ ok: true, text: `User ${form.email} created.` });
      setForm(emptyForm);
      load();
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Add New User" subtitle="Create a staff account.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Row>
            <Field
              label="Full Name"
              value={form.name}
              onChange={set("name")}
              placeholder="Jane Doe"
              required
            />
            <Field
              label="Email"
              value={form.email}
              onChange={set("email")}
              type="email"
              placeholder="jane@hotel.com"
              required
            />
          </Row>
          <Row>
            <div className="relative">
              <Field
                label="Password"
                value={form.password}
                onChange={set("password")}
                type={showPw ? "text" : "password"}
                placeholder="Min 6 characters"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-7 text-gray-400 hover:text-gray-600"
              >
                {showPw ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-gray-600">
                Role
              </label>
              <Select value={form.role} onChange={set("role")}>
                <option value="user">Staff</option>
                <option value="admin">Admin</option>
              </Select>
            </div>
          </Row>
          {msg && <Alert ok={msg.ok}>{msg.text}</Alert>}
          <SaveBtn loading={saving}>Create User</SaveBtn>
        </form>
      </Card>

      <Card
        title="All Users"
        subtitle={`${users.length} account${users.length !== 1 ? "s" : ""}`}
      >
        {loading ? (
          <Spinner />
        ) : users.length === 0 ? (
          <p className="py-6 text-center text-[13px] text-gray-400">
            No users found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Name", "Email", "Role", "Created"].map((h) => (
                    <th
                      key={h}
                      className="pb-2 text-left font-mono text-[11px] uppercase tracking-wider text-gray-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b border-gray-50 hover:bg-gray-50/50"
                  >
                    <td className="py-2.5 font-medium text-gray-900">
                      {u.name}
                    </td>
                    <td className="py-2.5 text-gray-600">{u.email}</td>
                    <td className="py-2.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          u.role === "admin"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
