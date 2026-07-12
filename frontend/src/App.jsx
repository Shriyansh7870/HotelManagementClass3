import { Navigate, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import CheckIn from "./pages/CheckIn";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import Housekeeping from "./pages/housekeeping";
import FoodOrder from "./pages/FoodOrder";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/check-in"
        element={
          <ProtectedRoute>
            <CheckIn />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />

      <Route
        path="/housekeeping"
        element={
          <ProtectedRoute>
            <div className="">
              <Housekeeping />
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/food-orders"
        element={
          <ProtectedRoute>
            <div className="">
              <FoodOrder />
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
