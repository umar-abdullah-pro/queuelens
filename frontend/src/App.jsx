import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

// import PatientDashboard from "./pages/PatientDashboard";
// import StaffDashboard from "./pages/StaffDashboard";
// import AdminDashboard from "./pages/AdminDashboard";

import Layout from "./components/Layout";
import ProtectedRoutes from "./components/ProtectedRoutes";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoutes allowedRoles={["patient", "staff", "admin"]} />
        }
      >
        <Route element={<Layout />}>
          {/* <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
