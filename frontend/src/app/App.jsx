import { Routes, Route } from "react-router-dom";

// Public pages
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";

// Patient pages
import BookAppointment from "../pages/BookAppointment";

// Components
import Layout from "../components/Layout";
import ProtectedRoutes from "../components/auth/ProtectedRoutes";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Patient Routes */}
      <Route element={<ProtectedRoutes allowedRoles={["patient"]} />}>
        <Route element={<Layout />}>
          <Route
            path="/patient/book-appointment"
            element={<BookAppointment />}
          />

          {/* Add PatientDashboard here when ready */}
          {/* <Route path="/patient/dashboard" element={<PatientDashboard />} /> */}
        </Route>
      </Route>

      {/* Staff Routes - add when StaffDashboard is ready */}
      {/* 
      <Route element={<ProtectedRoutes allowedRoles={["staff"]} />}>
        <Route element={<Layout />}>
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
        </Route>
      </Route>
      */}

      {/* Admin Routes - add when AdminDashboard is ready */}
      {/*
      <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
        <Route element={<Layout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Route>
      */}
    </Routes>
  );
};

export default App; 