import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <main
            style={{
              minHeight: "100vh",
              padding: "2rem",
              backgroundColor: "#f8f8f8",
              color: "#222",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <h1>Sistema de Apoio à Doação de Sangue</h1>
            <p>Projeto em desenvolvimento.</p>
          </main>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;