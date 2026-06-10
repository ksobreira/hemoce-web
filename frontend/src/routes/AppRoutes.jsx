import React from "react";
import { Link, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login/Login";
import Cadastro from "../pages/Cadastro/Cadastro";

import Home from "../pages/home/Home";
import Agendamentos from "../pages/agendamentos/Agendamentos";
import NovoAgendamento from "../pages/agendamentos/NovoAgendamento";
import DetalhesAgendamento from "../pages/agendamentos/DetalhesAgendamento";
import Campanhas from "../pages/campanhas/Campanhas";
import DetalhesCampanhas from "../pages/campanhas/DetalhesCampanhas";
import Orientacoes from "../pages/orientacoes/Orientacoes";

import AdminCampanhas from "../pages/admin/AdminCampanhas";
import AdminNovaCampanha from "../pages/admin/AdminNovaCampanha";
import AdminAgendamentos from "../pages/admin/AdminAgendamentos";

import Header from "../components/layout/Header";

import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import UsuarioRoute from "./UsuarioRoute";

function AdminPlaceholder() {
  return (
    <>
      <Header />

      <main
        style={{
          minHeight: "calc(100vh - 78px)",
          padding: "52px 24px 70px",
          backgroundColor: "var(--bg-principal)",
          fontFamily: "var(--fonte-principal)",
        }}
      >
        <section
          style={{
            maxWidth: "1100px",
            margin: "0 auto 30px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              color: "var(--cor-primaria)",
              fontSize: "0.75rem",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "10px",
            }}
          >
            Área administrativa
          </span>

          <h1
            style={{
              color: "var(--cor-escuro-total)",
              fontSize: "2rem",
              fontWeight: 900,
              marginBottom: "8px",
            }}
          >
            Painel Administrativo
          </h1>

          <p
            style={{
              color: "var(--cor-escuro-medium)",
              fontSize: "1rem",
              lineHeight: 1.6,
            }}
          >
            Gerencie campanhas, alertas e acompanhe agendamentos das unidades.
          </p>
        </section>

        <section
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "22px",
          }}
        >
          <Link
            to="/admin/campanhas"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid #eeeeee",
              borderRadius: "16px",
              padding: "28px",
              textDecoration: "none",
              boxShadow: "0 10px 26px rgba(0, 0, 0, 0.045)",
            }}
          >
            <strong
              style={{
                display: "block",
                color: "var(--cor-escuro-total)",
                fontSize: "1.1rem",
                fontWeight: 900,
                marginBottom: "8px",
              }}
            >
              Campanhas e Alertas
            </strong>

            <span
              style={{
                color: "#666666",
                fontSize: "0.92rem",
                lineHeight: 1.6,
              }}
            >
              Cadastre, visualize e remova campanhas vinculadas às unidades.
            </span>
          </Link>

          <Link
            to="/admin/agendamentos"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid #eeeeee",
              borderRadius: "16px",
              padding: "28px",
              textDecoration: "none",
              boxShadow: "0 10px 26px rgba(0, 0, 0, 0.045)",
            }}
          >
            <strong
              style={{
                display: "block",
                color: "var(--cor-escuro-total)",
                fontSize: "1.1rem",
                fontWeight: 900,
                marginBottom: "8px",
              }}
            >
              Agendamentos
            </strong>

            <span
              style={{
                color: "#666666",
                fontSize: "0.92rem",
                lineHeight: 1.6,
              }}
            >
              Consulte solicitações por unidade e data, confirmando ou alterando
              status.
            </span>
          </Link>
        </section>
      </main>
    </>
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
          <UsuarioRoute>
            <Home />
          </UsuarioRoute>
        }
      />

      <Route
        path="/agendamentos"
        element={
          <UsuarioRoute>
            <Agendamentos />
          </UsuarioRoute>
        }
      />

      <Route
        path="/agendamentos/novo"
        element={
          <UsuarioRoute>
            <NovoAgendamento />
          </UsuarioRoute>
        }
      />

      <Route
        path="/agendamentos/:id"
        element={
          <UsuarioRoute>
            <DetalhesAgendamento />
          </UsuarioRoute>
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
        path="/orientacoes"
        element={
          <PrivateRoute>
            <Orientacoes />
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
        path="/admin/campanhas"
        element={
          <AdminRoute>
            <AdminCampanhas />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/campanhas/nova"
        element={
          <AdminRoute>
            <AdminNovaCampanha />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/agendamentos"
        element={
          <AdminRoute>
            <AdminAgendamentos />
          </AdminRoute>
        }
      />

      <Route
        path="*"
        element={
          <div style={{ color: "#fff", padding: "20px" }}>
            Página não encontrada (404)
          </div>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
