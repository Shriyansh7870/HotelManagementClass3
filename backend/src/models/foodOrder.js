import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
    },
    name: { type: String, required: true, trim: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const foodOrderSchema = new mongoose.Schema(
  {
    guestName: {
      type: String,
      required: [true, "Guest Name is required"],
      trim: true,
    },
    roomNumber: {
      type: String,
      required: [true, "Room Number is required"],
      trim: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: function (items) {
          return items.length > 0;
        },
        message: "At least one item is required",
      },
    },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "preparing", "served", "cancelled"],
      default: "pending",
    },
    notes: { type: String, default: null, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("FoodOrder", foodOrderSchema);
