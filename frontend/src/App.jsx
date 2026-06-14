import { Navigate, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import CheckIn from "./pages/CheckIn";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import Register from "./pages/Register";

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
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
