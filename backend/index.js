import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import connectDB from "./src/config/db.js";
import authRoute from "./src/routes/auth.js";
import checinRoute from "./src/routes/checkin.js";
import settingRoute from "./src/routes/settings.js";
import { errorHandler, notFound } from "./src/middleWare/errorMiddleware.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Api is working Fine For Hotel Management System",
  });
});

app.use("/api/auth", authRoute);
app.use("/api/checkins", checinRoute);
app.use("/api/settings", settingRoute);

// 404 + error handlers (must come last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
