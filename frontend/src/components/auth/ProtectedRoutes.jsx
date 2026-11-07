import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../app/AuthProvider";
import LoadingScreen from "../common/LoadingScreen";

const ProtectedRoutes = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet context={{ user }} />;
};

export default ProtectedRoutes;
