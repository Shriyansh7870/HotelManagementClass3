import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getFoodOrders,
  createFoodOrder,
  updateFoodOrderStatus,
  deleteFoodOrder,
} from "../api/food";

const STATUS_STYLES = {
  pending: "bg-yellow-50 text-yellow-700",
  preparing: "bg-blue-50 text-blue-700",
  served: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-gray-100 text-gray-500",
};

const NEXT_STATUS = { pending: "preparing", preparing: "served" };

export default function FoodOrders() {
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Order form state
  const [guestName, setGuestName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemQty, setItemQty] = useState(1);
  const [itemPrice, setItemPrice] = useState("");
  const [cart, setCart] = useState([]); // [{name, qty, price}]

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setFetching(true);
    try {
      const ordersData = await getFoodOrders();
      setOrders(ordersData.foodOrders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  }

  function addToCart() {
    if (!itemName.trim() || !itemPrice) return;
    const price = parseFloat(itemPrice);
    if (isNaN(price) || price < 0) return;
    setCart((prev) => [
      ...prev,
      { name: itemName.trim(), qty: itemQty, price },
    ]);
    setItemName("");
    setItemQty(1);
    setItemPrice("");
  }

  function removeFromCart(index) {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }

  function updateQty(index, qty) {
    if (qty < 1) return removeFromCart(index);
    setCart((prev) => prev.map((c, i) => (i === index ? { ...c, qty } : c)));
  }

  function cartTotal() {
    return cart.reduce((s, c) => s + c.price * c.qty, 0);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (cart.length === 0) {
      setError("Add at least one item to the order.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await createFoodOrder({
        guestName,
        roomNumber,
        notes,
        items: cart.map((c) => ({
          name: c.name,
          qty: c.qty,
          price: c.price,
        })),
      });
      setGuestName("");
      setRoomNumber("");
      setNotes("");
      setCart([]);
      setShowForm(false);
      await fetchAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(id, status) {
    try {
      await updateFoodOrderStatus(id, status);
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o))
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this order?")) return;
    try {
      await deleteFoodOrder(id);
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  const filtered =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.28em] text-amber-600/70">
            Restaurant
          </p>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Food Orders
          </h1>
          <p className="mt-1.5 text-[14px] text-gray-400">
            Place and manage guest food orders.
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
            <path d={showForm ? "M18 6 6 18M6 6l12 12" : "M12 5v14M5 12h14"} />
          </svg>
          {showForm ? "Close" : "Place Order"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
          {error}
        </div>
      )}

      {/* Order Form */}
      {showForm && (
        <div className="mb-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-serif text-lg font-semibold text-gray-900">
              Order Details
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-gray-500">
                    Guest Name
                  </label>
                  <input
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                    placeholder="John Doe"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-gray-500">
                    Room Number
                  </label>
                  <input
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    required
                    placeholder="101"
                    className={inputCls}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-gray-500">
                  Notes
                </label>
                <input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Allergies, special requests…"
                  className={inputCls}
                />
              </div>

              {/* Add Item */}
              <div className="mb-4 rounded-xl border border-dashed border-gray-200 p-4">
                <label className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-gray-500">
                  Add Item
                </label>
                <div className="mb-3 grid grid-cols-3 gap-3">
                  <div>
                    <label className="mb-1 block text-[11px] text-gray-400">
                      Item Name
                    </label>
                    <input
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder="e.g. Caesar Salad"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-gray-400">
                      Qty
                    </label>
                    <input
                      value={itemQty}
                      onChange={(e) =>
                        setItemQty(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      type="number"
                      min="1"
                      placeholder="1"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-gray-400">
                      Price ($)
                    </label>
                    <input
                      value={itemPrice}
                      onChange={(e) => setItemPrice(e.target.value)}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="12.99"
                      className={inputCls}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addToCart}
                  className="rounded-lg bg-amber-600 px-5 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-white hover:bg-amber-700"
                >
                  + Add to Order
                </button>
              </div>

              {/* Cart Items */}
              {cart.length === 0 ? (
                <p className="mb-4 text-center text-[13px] text-gray-300">
                  No items added yet.
                </p>
              ) : (
                <div className="mb-4 space-y-2">
                  {cart.map((c, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                    >
                      <span className="text-[13px] text-gray-800">
                        {c.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQty(idx, c.qty - 1)}
                          className="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-100"
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-mono text-[13px]">
                          {c.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(idx, c.qty + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-100"
                        >
                          +
                        </button>
                        <span className="w-16 text-right font-mono text-[12px] text-amber-600">
                          ${(c.price * c.qty).toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(idx)}
                          className="text-red-400 hover:text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="mt-2 flex justify-between border-t border-gray-100 pt-2 font-mono text-[13px]">
                    <span className="text-gray-500">Total</span>
                    <span className="font-semibold text-amber-700">
                      ${cartTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-amber-600 py-2.5 font-mono text-[12px] font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-amber-700 disabled:opacity-50"
              >
                {loading ? "Placing…" : "Place Order"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="mb-4 flex items-center gap-3">
        {["all", "pending", "preparing", "served", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider transition ${
              filterStatus === s
                ? "bg-amber-600 text-white"
                : "border border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-600"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className={thCls}>Guest / Room</th>
                <th className={thCls}>Items</th>
                <th className={thCls}>Total</th>
                <th className={thCls}>Notes</th>
                <th className={thCls}>Status</th>
                <th className={thCls}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fetching ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-300">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr
                    key={o._id}
                    className="border-b border-gray-50 hover:bg-amber-50/20"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {o.guestName}
                      </div>
                      <div className="font-mono text-[12px] text-gray-400">
                        Room {o.roomNumber}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-amber-700">
                      ${o.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-gray-400">
                      {o.notes || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase ${
                          STATUS_STYLES[o.status]
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {NEXT_STATUS[o.status] && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(o._id, NEXT_STATUS[o.status])
                            }
                            className="rounded-lg border border-amber-200 px-2.5 py-1 font-mono text-[11px] uppercase text-amber-600 hover:bg-amber-50"
                          >
                            → {NEXT_STATUS[o.status]}
                          </button>
                        )}
                        {o.status === "pending" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(o._id, "cancelled")
                            }
                            className="rounded-lg border border-gray-200 px-2.5 py-1 font-mono text-[11px] uppercase text-gray-500 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(o._id)}
                          className="rounded-lg border border-red-200 p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
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

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] text-gray-800 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400";
const thCls =
  "px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-gray-500";
