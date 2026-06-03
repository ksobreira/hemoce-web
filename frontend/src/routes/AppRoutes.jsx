import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/home/Home";
import Agendamentos from "../pages/agendamentos/Agendamentos";

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

      <Route path="/agendamentos" element={<Agendamentos />} />

      <Route
        path="/agendamentos/novo"
        element={
          <PlaceholderPage
            title="Novo Agendamento"
            description="Formulário de novo agendamento será criado no próximo passo."
          />
        }
      />

      <Route
        path="/agendamentos/:id"
        element={
          <PlaceholderPage
            title="Detalhes do Agendamento"
            description="Detalhes do agendamento serão criados depois do formulário."
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