import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/home/Home";

function PlaceholderPage({ title, description }) {
  return (
    <main style={{ padding: "40px", fontFamily: "var(--fonte-principal)" }}>
      <h1>{title}</h1>
      <p>{description}</p>
    </main>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route path="/home" element={<Home />} />

      <Route
        path="/agendamentos"
        element={
          <PlaceholderPage
            title="Agendamentos"
            description="Tela de listagem de agendamentos será criada no próximo passo."
          />
        }
      />

      <Route
        path="/agendamentos/novo"
        element={
          <PlaceholderPage
            title="Novo Agendamento"
            description="Formulário de novo agendamento será criado em breve."
          />
        }
      />

      <Route
        path="/campanhas"
        element={
          <PlaceholderPage
            title="Campanhas e Alertas"
            description="Tela de campanhas e alertas será criada nos próximos passos."
          />
        }
      />

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default AppRoutes;