import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/home/Home";
import Agendamentos from "../pages/agendamentos/Agendamentos";
import NovoAgendamento from "../pages/agendamentos/NovoAgendamento";
import DetalhesAgendamento from "../pages/agendamentos/DetalhesAgendamento";
import Campanhas from "../pages/campanhas/Campanhas";

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
      <Route path="/agendamentos/novo" element={<NovoAgendamento />} />
      <Route path="/agendamentos/:id" element={<DetalhesAgendamento />} />

      <Route path="/campanhas" element={<Campanhas />} />

      <Route
        path="/campanhas/:id"
        element={
          <PlaceholderPage
            title="Detalhes da Campanha"
            description="Detalhes da campanha serão criados no próximo passo."
          />
        }
      />

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default AppRoutes;