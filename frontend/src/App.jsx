import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";

function PatientDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Patient Dashboard</h1>
      <p className="mt-2 text-slate-500">Welcome to QueueLens.</p>
    </div>
  );
}

function StaffDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Staff Dashboard</h1>
      <p className="mt-2 text-slate-500">Welcome to QueueLens.</p>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
      <p className="mt-2 text-slate-500">Welcome to QueueLens.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <DashboardLayout>
                <PatientDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <DashboardLayout>
                <StaffDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
