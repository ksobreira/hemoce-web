import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/Login/Login';
import Cadastro from '../pages/Cadastro/Cadastro';

import Home from '../pages/home/Home';
import Agendamentos from '../pages/agendamentos/Agendamentos';
import NovoAgendamento from '../pages/agendamentos/NovoAgendamento';
import DetalhesAgendamento from '../pages/agendamentos/DetalhesAgendamento';
import Campanhas from '../pages/campanhas/Campanhas';
import DetalhesCampanhas from '../pages/campanhas/DetalhesCampanhas';

import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

function AdminPlaceholder() {
  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '40px',
        backgroundColor: '#f8f9fa',
        fontFamily: 'var(--fonte-principal)',
      }}
    >
      <h1>Painel Administrativo</h1>
      <p>
        Área administrativa em construção. Aqui entrarão as telas de gestão de
        campanhas, alertas e agendamentos.
      </p>
    </main>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />

      <Route
        path="/agendamentos"
        element={
          <PrivateRoute>
            <Agendamentos />
          </PrivateRoute>
        }
      />

      <Route
        path="/agendamentos/novo"
        element={
          <PrivateRoute>
            <NovoAgendamento />
          </PrivateRoute>
        }
      />

      <Route
        path="/agendamentos/:id"
        element={
          <PrivateRoute>
            <DetalhesAgendamento />
          </PrivateRoute>
        }
      />

      <Route
        path="/campanhas"
        element={
          <PrivateRoute>
            <Campanhas />
          </PrivateRoute>
        }
      />

      <Route
        path="/campanhas/:id"
        element={
          <PrivateRoute>
            <DetalhesCampanhas />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPlaceholder />
          </AdminRoute>
        }
      />

      <Route
        path="*"
        element={
          <div style={{ color: '#fff', padding: '20px' }}>
            Página não encontrada (404)
          </div>
        }
      />
    </Routes>
  );
}

export default AppRoutes;