import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function UsuarioRoute({ children }) {
  const { isAuthenticated, isUsuario, isAdmin, loadingAuth } = useAuth();

  if (loadingAuth) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  if (!isUsuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default UsuarioRoute;