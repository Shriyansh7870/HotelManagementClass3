import { useEffect, useState } from "react";
import { getRooms, addRoom, deleteRoom } from "../api/settings";
import {
  Card,
  Row,
  Field,
  Select,
  Alert,
  SaveBtn,
  Spinner,
  StatusBadge,
} from "./SettingsUI";

export default function RoomsTab() {
  const emptyForm = {
    roomNumber: "",
    type: "single",
    floor: "",
    capacity: "",
    pricePerNight: "",
    status: "available",
    description: "",
  };
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = () =>
    getRooms()
      .then((r) => setRooms(r.data))
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
      await addRoom(form);
      setMsg({ ok: true, text: `Room ${form.roomNumber} added.` });
      setForm(emptyForm);
      load();
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, num) => {
    if (!confirm(`Delete room ${num}?`)) return;
    try {
      await deleteRoom(id);
      setRooms((r) => r.filter((x) => x._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Shriyansh12345" subtitle="Register a room in your property.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Row>
            <Field
              label="Room Number"
              value={form.roomNumber}
              onChange={set("roomNumber")}
              placeholder="101"
              required
            />
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-gray-600">
                Type
              </label>
              <Select value={form.type} onChange={set("type")}>
                {["single", "double", "suite", "deluxe", "presidential"].map(
                  (t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  )
                )}
              </Select>
            </div>
          </Row>
          <Row>
            <Field
              label="Floor"
              value={form.floor}
              onChange={set("floor")}
              type="number"
              min={1}
              placeholder="1"
              required
            />
            <Field
              label="Capacity (guests)"
              value={form.capacity}
              onChange={set("capacity")}
              type="number"
              min={1}
              placeholder="2"
              required
            />
          </Row>
          <Row>
            <Field
              label="Price / Night ($)"
              value={form.pricePerNight}
              onChange={set("pricePerNight")}
              type="number"
              min={0}
              placeholder="199"
              required
            />
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-gray-600">
                Status
              </label>
              <Select value={form.status} onChange={set("status")}>
                {["available", "occupied", "maintenance", "reserved"].map(
                  (s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  )
                )}
              </Select>
            </div>
          </Row>
          <Field
            label="Description (optional)"
            value={form.description}
            onChange={set("description")}
            placeholder="Corner suite with sea view"
          />
          {msg && <Alert ok={msg.ok}>{msg.text}</Alert>}
          <SaveBtn loading={saving}>Add Room</SaveBtn>
        </form>
      </Card>

      <Card
        title="All Rooms"
        subtitle={`${rooms.length} room${
          rooms.length !== 1 ? "s" : ""
        } registered`}
      >
        {loading ? (
          <Spinner />
        ) : rooms.length === 0 ? (
          <p className="py-6 text-center text-[13px] text-gray-400">
            No rooms yet. Add one above.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {[
                    "Room",
                    "Type",
                    "Floor",
                    "Capacity",
                    "Price/Night",
                    "Status",
                    "",
                  ].map((h) => (
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
                {rooms.map((r) => (
                  <tr
                    key={r._id}
                    className="border-b border-gray-50 hover:bg-gray-50/50"
                  >
                    <td className="py-2.5 font-medium text-gray-900">
                      {r.roomNumber}
                    </td>
                    <td className="py-2.5 capitalize text-gray-600">
                      {r.type}
                    </td>
                    <td className="py-2.5 text-gray-600">{r.floor}</td>
                    <td className="py-2.5 text-gray-600">{r.capacity}</td>
                    <td className="py-2.5 text-gray-700">${r.pricePerNight}</td>
                    <td className="py-2.5">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="py-2.5">
                      <button
                        onClick={() => handleDelete(r._id, r.roomNumber)}
                        className="rounded px-2 py-1 text-[11px] text-red-400 hover:bg-red-50 hover:text-red-600 transition"
                      >
                        Delete
                      </button>
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
