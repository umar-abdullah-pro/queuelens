//responsibility -> this file owns the authentication state of the application and provides it to the rest of the app via context (useAuth() hook)
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the currently logged-in user
  const refreshUser = useCallback(async () => {
    const data = await api("/auth/me");

    setUser(data.user || null);

    return data.user || null;
  }, []);

  // Check authentication when the application starts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await refreshUser();
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [refreshUser]);

  // Logout the current user
  const logout = async () => {
    await api("/auth/logout", {
      method: "POST",
    });

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;