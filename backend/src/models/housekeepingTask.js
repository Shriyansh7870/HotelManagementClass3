import mongoose from "mongoose";

const houseKeepingTaskSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, "Room Number is required"],
      trim: true,
    },
    taskType: {
      type: String,
      required: [true, "Task Type is required"],
      enum: ["cleaning", "Maintenance", "Inspection"],
      trim: true,
    },

    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    assignedTo: { type: String, default: null, trim: true },
    priority: {
      type: String,
      required: [true, "Priority is required"],
      enum: ["low", "medium", "high"],
      default: "Normal",
    },
    notes: { type: String, default: null, trim: true },
    dueDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("HouseKeepingTask", houseKeepingTaskSchema);
