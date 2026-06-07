import React, { createContext, useEffect, useState } from "react";
import { authService } from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    accessToken: null,
    refreshToken: null,
    role: null,
  });

  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const role = localStorage.getItem("role");

    if (accessToken && role) {
      setAuth({
        accessToken,
        refreshToken,
        role,
      });
    }

    setLoadingAuth(false);
  }, []);

  async function login(email, senha) {
    const response = await authService.login({ email, senha });

    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);
    localStorage.setItem("role", response.role);

    setAuth({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      role: response.role,
    });

    return response;
  }

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");

    setAuth({
      accessToken: null,
      refreshToken: null,
      role: null,
    });
  }

  const isAuthenticated = Boolean(auth.accessToken);
  const isAdmin = auth.role === "ROLE_ADMIN";
  const isUsuario = auth.role === "ROLE_USUARIO";

  return (
    <AuthContext.Provider
      value={{
        auth,
        loadingAuth,
        isAuthenticated,
        isAdmin,
        isUsuario,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}