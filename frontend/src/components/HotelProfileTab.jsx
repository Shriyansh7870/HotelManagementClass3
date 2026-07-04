import { useEffect, useState } from "react";
import { getHotelProfile, updateHotelProfile } from "../api/settings";
import { Card, Row, Field, Alert, SaveBtn, Spinner } from "./SettingsUI";

export default function HotelProfileTab() {
  const empty = {
    name: "",
    address: "",
    city: "",
    country: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    starRating: 3,
    checkInTime: "14:00",
    checkOutTime: "11:00",
    currency: "USD",
    taxRate: 0,
  };
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    getHotelProfile()
      .then((res) => setForm({ ...empty, ...res.data }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await updateHotelProfile(form);
      setMsg({ ok: true, text: "Hotel profile saved." });
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <Card title="Shriyansh Kumar" subtitle="Demo Class">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Row>
          <Field
            label="Hotel Name"
            value={form.name}
            onChange={set("name")}
            placeholder="Grand Luxe Hotel"
          />
          <Field
            label="Star Rating"
            value={form.starRating}
            onChange={set("starRating")}
            type="number"
            min={1}
            max={5}
          />
        </Row>
        <Row>
          <Field
            label="Address"
            value={form.address}
            onChange={set("address")}
            placeholder="123 Main Street"
          />
          <Field
            label="City"
            value={form.city}
            onChange={set("city")}
            placeholder="Dubai"
          />
        </Row>
        <Row>
          <Field
            label="Country"
            value={form.country}
            onChange={set("country")}
            placeholder="UAE"
          />
          <Field
            label="Phone"
            value={form.phone}
            onChange={set("phone")}
            placeholder="+1 800 000 0000"
          />
        </Row>
        <Row>
          <Field
            label="Email"
            value={form.email}
            onChange={set("email")}
            type="email"
            placeholder="info@hotel.com"
          />
          <Field
            label="Website"
            value={form.website}
            onChange={set("website")}
            placeholder="https://hotel.com"
          />
        </Row>
        <Row>
          <Field
            label="Check-in Time"
            value={form.checkInTime}
            onChange={set("checkInTime")}
            type="time"
          />
          <Field
            label="Check-out Time"
            value={form.checkOutTime}
            onChange={set("checkOutTime")}
            type="time"
          />
        </Row>
        <Row>
          <Field
            label="Currency"
            value={form.currency}
            onChange={set("currency")}
            placeholder="USD"
          />
          <Field
            label="Tax Rate (%)"
            value={form.taxRate}
            onChange={set("taxRate")}
            type="number"
            min={0}
            max={100}
          />
        </Row>
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-gray-600">
            Description
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={set("description")}
            placeholder="A brief description of your property..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] text-gray-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none"
          />
        </div>
        {msg && <Alert ok={msg.ok}>{msg.text}</Alert>}
        <SaveBtn loading={saving}>Save Hotel Profile</SaveBtn>
      </form>
    </Card>
  );
}
