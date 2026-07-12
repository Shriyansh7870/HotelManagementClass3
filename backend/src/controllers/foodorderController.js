import FoodOrder from "../models/foodOrder.js";

export const getFoodOrders = async (req, res, next) => {
  try {
    const foodOrders = await FoodOrder.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Food orders retrieved successfully",
      foodOrders,
    });
  } catch (err) {
    next(err);
  }
};

export const createFoodOrder = async (req, res, next) => {
  try {
    const { guestName, roomNumber, items, notes } = req.body;
    if (!guestName || !roomNumber || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Guest Name, Room Number and Items are required",
      });
    }
    const totalAmount = items.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );
    const order = await FoodOrder.create({
      guestName,
      roomNumber,
      items,
      totalAmount,
      notes,
    });
    return res.status(201).json({
      success: true,
      message: "Food order created successfully",
      order,
    });
  } catch (err) {
    next(err);
  }
};

export const updateFoodOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const allowed = ["pending", "preparing", "served", "cancelled"];
    const { status } = req.body;
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }
    const order = await FoodOrder.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Food order not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Food order status updated successfully",
      order,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteFoodOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await FoodOrder.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Food order not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Food order deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
