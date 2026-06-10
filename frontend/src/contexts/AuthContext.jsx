import React, { createContext, useCallback, useEffect, useState } from "react";
import { authService, perfilService } from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    accessToken: null,
    refreshToken: null,
    role: null,
    userName: null,
    userEmail: null,
  });

  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const role = localStorage.getItem("role");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail") || localStorage.getItem("email");

    if (accessToken && role) {
      setAuth({
        accessToken,
        refreshToken,
        role,
        userName,
        userEmail,
      });
    }

    setLoadingAuth(false);
  }, []);

  async function login(email, senha) {
    const response = await authService.login({ email, senha });

    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);
    localStorage.setItem("role", response.role);

    let profile = null;

    try {
      profile =
        response.role === "ROLE_ADMIN"
          ? await perfilService.obterPerfilAdmin()
          : await perfilService.obterPerfil();
    } catch {
      profile = null;
    }

    const userName = response.nome || response.name || profile?.nome || "";
    const userEmail = response.email || profile?.email || email;

    if (userName) {
      localStorage.setItem("userName", userName);
    } else {
      localStorage.removeItem("userName");
    }

    localStorage.setItem("userEmail", userEmail);
    localStorage.setItem("email", userEmail);

    setAuth({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      role: response.role,
      userName,
      userEmail,
    });

    return response;
  }

  const updateUserData = useCallback(({ name, email } = {}) => {
    setAuth((currentAuth) => {
      const nextAuth = {
        ...currentAuth,
        userName: name ?? currentAuth.userName,
        userEmail: email ?? currentAuth.userEmail,
      };

      if (nextAuth.userName) {
        localStorage.setItem("userName", nextAuth.userName);
      } else {
        localStorage.removeItem("userName");
      }

      if (nextAuth.userEmail) {
        localStorage.setItem("userEmail", nextAuth.userEmail);
        localStorage.setItem("email", nextAuth.userEmail);
      }

      return nextAuth;
    });
  }, []);

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    setAuth({
      accessToken: null,
      refreshToken: null,
      role: null,
      userName: null,
      userEmail: null,
    });
  }

  const isAuthenticated = Boolean(auth.accessToken);
  const isAdmin = auth.role === "ROLE_ADMIN";
  const isUsuario = auth.role === "ROLE_USUARIO";
  const userName = auth.userName;
  const userEmail = auth.userEmail;
  const role = auth.role;

  return (
    <AuthContext.Provider
      value={{
        auth,
        loadingAuth,
        isAuthenticated,
        isAdmin,
        isUsuario,
        userName,
        userEmail,
        role,
        login,
        logout,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
