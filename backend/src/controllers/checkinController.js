import Checkin from "../models/Checkin.js";
import Room from "../models/room.js";

export const createCheckin = async (req, res, next) => {
  try {
    const {
      guestName,
      email,
      phone,
      roomNumber,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      idProof,
      idProofNumber,
      status,
    } = req.body;

    if (
      !guestName ||
      !email ||
      !phone ||
      !roomNumber ||
      !checkInDate ||
      !checkOutDate ||
      !numberOfGuests ||
      !idProof ||
      !idProofNumber ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });
    }

    const checkin = await Checkin.create({
      guestName,
      email,
      phone,
      roomNumber,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      idProof,
      idProofNumber,
      status,
    });
    return res.status(201).json({
      success: true,
      message: "Check-in created successfully",
      checkin,
    });
  } catch (err) {
    next(err);
  }
};

export const getCheckins = async (req, res, next) => {
  try {
    const checkins = await Checkin.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Check-ins retrieved successfully",
      checkins,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCheckin = async (req, res, next) => {
  try {
    const checkin = await Checkin.findByIdAndDelete(req.params.id);
    if (!checkin) {
      return res.status(404).json({
        success: false,
        message: "Check-in not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Check-in deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const updateCheckin = async (req, res, next) => {
  try {
    const checkin = await Checkin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!checkin) {
      return res.status(404).json({
        success: false,
        message: "Check-in not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Check-in updated successfully",
      checkin,
    });
  } catch (err) {
    next(err);
  }
};

// export const getCheckoutSummary = async (req, res, next) => {
//   try {
//     const checkins = await Checkin.findById(req.params.id);
//     if (!checkins) {
//       return res.status(404).json({
//         success: false,
//         message: "Check-in not found",
//       });
//     }
//     const room = await Room.findByOne({
//       roomNumber: checkins.roomNumber,
//     }).lean();
//     const pricePerNight = room.pricePerNight;
//     const nights = Math.max(
//       1,
//       Math.ceil(
//         (new Date(checkins.checkOutDate) - new Date(checkins.checkInDate)) /
//           (1000 * 60 * 60 * 24)
//       )
//     );
//     const roomCharges = pricePerNight * nights;
//     const foodOrders = await FoodOrder.find({
//       roomNumber: checkin.roomNumber,
//       status: { $ne: "cancelled" },
//       createdAt: { $gte: checkins.checkInDate, $lte: checkins.checkOutDate },
//     }).lean();

//     const totalFoodCharges = foodOrders.reduce(
//       (total, order) => total + order.totalPrice,
//       0
//     );
//     const hotel = await Hotel.findById(room.hotelId).lean();
//     const taxRate = hotel.taxRate || 0;
//     const taxAmount = (roomCharges + totalFoodCharges) * (taxRate / 100);
//     const totalAmount = roomCharges + totalFoodCharges + taxAmount;

//     return res.status(200).json({
//       success: true,
//       message: "Checkout summary retrieved successfully",
//       summary: {
//         checkin,
//         roomType: room.roomType,
//         pricePerNight,
//         nights,
//         roomCharges,
//         foodOrdersCount: foodOrders.length,
//         totalFoodCharges,
//         taxRate,
//         taxAmount,
//         totalAmount,
//         grandTotal,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };
