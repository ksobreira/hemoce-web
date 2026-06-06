import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import { campanhasService } from "../../services/api";
import styles from "./AdminCampanhas.module.css";

function formatarTipoSanguineo(tipo) {
  const mapa = {
    A_POS: "A+",
    A_NEG: "A-",
    B_POS: "B+",
    B_NEG: "B-",
    AB_POS: "AB+",
    AB_NEG: "AB-",
    O_POS: "O+",
    O_NEG: "O-",
  };

  return mapa[tipo] || tipo;
}

function formatarTiposSanguineos(tipos = []) {
  if (!tipos || tipos.length === 0) {
    return "Todos";
  }

  return tipos.map(formatarTipoSanguineo).join(", ");
}

function formatarUrgencia(urgencia) {
  const mapa = {
    NORMAL: "Normal",
    ALTA: "Alta",
    CRITICA: "Crítica",
  };

  return mapa[urgencia] || urgencia || "Normal";
}

function formatarStatus(status) {
  const mapa = {
    AGENDADA: "Agendada",
    ATIVA: "Ativa",
    ENCERRADA: "Encerrada",
  };

  return mapa[status] || status || "Não informado";
}

function AdminCampanhas() {
  const [campanhas, setCampanhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarCampanhas() {
    try {
      setLoading(true);
      setErro("");

      const dados = await campanhasService.listarCampanhasAdmin();
      setCampanhas(Array.isArray(dados) ? dados : []);
    } catch (error) {
      setErro(error.message || "Não foi possível carregar as campanhas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarCampanhas();
  }, []);

  async function handleExcluirCampanha(id) {
    const confirmou = window.confirm(
      "Tem certeza que deseja excluir esta campanha? Essa ação não poderá ser desfeita."
    );

    if (!confirmou) {
      return;
    }

    try {
      await campanhasService.excluirCampanha(id);
      await carregarCampanhas();
    } catch (error) {
      alert(error.message || "Não foi possível excluir a campanha.");
    }
  }

  return (
    <>
      <Header />

      <main className={styles.page}>
        <section className={styles.pageHeader}>
          <div>
            <span className={styles.eyebrow}>Área administrativa</span>
            <h1>Gerenciamento de Campanhas</h1>
            <p>
              Visualize, cadastre e gerencie campanhas e alertas de estoque.
            </p>
          </div>

          <Link to="/admin/campanhas/nova" className={styles.primaryButton}>
            + Nova campanha
          </Link>
        </section>

        <section className={styles.contentCard}>
          {loading && (
            <div className={styles.feedbackBox}>
              <p>Carregando campanhas...</p>
            </div>
          )}

          {erro && (
            <div className={styles.errorBox}>
              <p>{erro}</p>
            </div>
          )}

          {!loading && !erro && campanhas.length === 0 && (
            <div className={styles.feedbackBox}>
              <h2>Nenhuma campanha cadastrada</h2>
              <p>
                Use o botão “Nova campanha” para cadastrar uma campanha ou alerta
                de estoque.
              </p>
            </div>
          )}

          {!loading && !erro && campanhas.length > 0 && (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Tipos</th>
                    <th>Unidade</th>
                    <th>Urgência</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {campanhas.map((campanha) => (
                    <tr key={campanha.id}>
                      <td>
                        <strong>{campanha.titulo}</strong>
                        <span>{campanha.descricao}</span>
                      </td>

                      <td>{formatarTiposSanguineos(campanha.tiposSanguineosNecessarios)}</td>

                      <td>
                        {campanha.hemocentroNome ||
                          campanha.nomeHemocentro ||
                          "Unidade vinculada"}
                      </td>

                      <td>
                        <span className={styles.badge}>
                          {formatarUrgencia(campanha.urgencia)}
                        </span>
                      </td>

                      <td>{formatarStatus(campanha.status)}</td>

                      <td>
                        <div className={styles.actions}>
                          <Link
                            to={`/campanhas/${campanha.id}`}
                            className={styles.secondaryButton}
                          >
                            Ver
                          </Link>

                          <button
                            type="button"
                            className={styles.dangerButton}
                            onClick={() => handleExcluirCampanha(campanha.id)}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default AdminCampanhas;