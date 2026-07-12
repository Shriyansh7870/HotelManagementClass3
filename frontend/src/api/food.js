import { apiRequest } from "./client.js";

export const getFoodOrders = () => apiRequest("/food-orders");

export const createFoodOrder = (data) =>
  apiRequest("/food-orders", { method: "POST", body: data });

export const updateFoodOrderStatus = (id, status) =>
  apiRequest(`/food-orders/${id}/status`, {
    method: "PATCH",
    body: { status },
  });

export const deleteFoodOrder = (id) =>
  apiRequest(`/food-orders/${id}`, { method: "DELETE" });
