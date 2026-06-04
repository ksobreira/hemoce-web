import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/home/Home";
import Agendamentos from "../pages/agendamentos/Agendamentos";
import NovoAgendamento from "../pages/agendamentos/NovoAgendamento";
import DetalhesAgendamento from "../pages/agendamentos/DetalhesAgendamento";
import Campanhas from "../pages/campanhas/Campanhas";
import DetalhesCampanhas from "../pages/campanhas/DetalhesCampanhas";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route path="/home" element={<Home />} />

      <Route path="/agendamentos" element={<Agendamentos />} />
      <Route path="/agendamentos/novo" element={<NovoAgendamento />} />
      <Route path="/agendamentos/:id" element={<DetalhesAgendamento />} />

      <Route path="/campanhas" element={<Campanhas />} />
      <Route path="/campanhas/:id" element={<DetalhesCampanhas />} />

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default AppRoutes;