import { useState } from "react";
import { changePassword } from "../api/settings";
import { Card, PwField, Alert, SaveBtn } from "./SettingsUI";

export default function ChangePasswordTab() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [show, setShow] = useState({ cur: false, nw: false, cf: false });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const toggleShow = (k) => setShow((s) => ({ ...s, [k]: !s[k] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setMsg({ ok: false, text: "New passwords do not match." });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setMsg({ ok: true, text: "Password changed successfully." });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Change Password" subtitle="Update your account password.">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <PwField
          label="Current Password"
          value={form.currentPassword}
          onChange={set("currentPassword")}
          show={show.cur}
          onToggle={() => toggleShow("cur")}
          placeholder="Your current password"
        />
        <PwField
          label="New Password"
          value={form.newPassword}
          onChange={set("newPassword")}
          show={show.nw}
          onToggle={() => toggleShow("nw")}
          placeholder="Min 6 characters"
        />
        <PwField
          label="Confirm New Password"
          value={form.confirmPassword}
          onChange={set("confirmPassword")}
          show={show.cf}
          onToggle={() => toggleShow("cf")}
          placeholder="Repeat new password"
        />
        {msg && <Alert ok={msg.ok}>{msg.text}</Alert>}
        <SaveBtn loading={saving}>Change Password</SaveBtn>
      </form>
    </Card>
  );
}
