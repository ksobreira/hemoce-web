import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import { agendamentosService, campanhasService } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import styles from "./Home.module.css";

function formatarData(data) {
  if (!data) return "Data não informada";

  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function formatarHorario(horario) {
  if (!horario) return "--:--";
  return horario.slice(0, 5);
}

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
    return "Todos os tipos";
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

function Home() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [agendamentoAtivo, setAgendamentoAtivo] = useState(null);
  const [campanhaDestaque, setCampanhaDestaque] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      return;
    }

    async function carregarResumo() {
      try {
        setLoading(true);
        setErro("");

        const [agendamentos, campanhas] = await Promise.all([
          agendamentosService.listarAgendamentosAtivos(),
          campanhasService.listarCampanhas(),
        ]);

        const listaAgendamentos = Array.isArray(agendamentos)
          ? agendamentos
          : [];

        const listaCampanhas = Array.isArray(campanhas) ? campanhas : [];

        setAgendamentoAtivo(listaAgendamentos[0] || null);

        const campanhaPrioritaria =
          listaCampanhas.find((campanha) => campanha.urgencia === "CRITICA") ||
          listaCampanhas.find((campanha) => campanha.urgencia === "ALTA") ||
          listaCampanhas[0] ||
          null;

        setCampanhaDestaque(campanhaPrioritaria);
      } catch (error) {
        setErro(
          error.message ||
            "Não foi possível carregar o resumo da página inicial."
        );
      } finally {
        setLoading(false);
      }
    }

    carregarResumo();
  }, [isAdmin]);

  return (
    <>
      <Header />

      <main className={styles.page}>
        <section className={styles.hero}>
          <div>
            <span className={styles.eyebrow}>Sangue Amigo</span>
            <h1>Bem-vindo ao sistema de apoio à doação de sangue</h1>
            <p>
              Acompanhe campanhas, consulte seus agendamentos e escolha o melhor
              horário para realizar uma doação.
            </p>
          </div>

          <Link to="/agendamentos/novo" className={styles.heroButton}>
            Agendar doação
          </Link>
        </section>

        {erro && (
          <section className={styles.errorBox}>
            <p>{erro}</p>
          </section>
        )}

        <section className={styles.summaryGrid}>
          <article className={styles.summaryCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>📅</span>
              <div>
                <h2>Próximo agendamento</h2>
                <p>Resumo do seu agendamento ativo mais recente.</p>
              </div>
            </div>

            {loading ? (
              <p className={styles.emptyText}>Carregando agendamentos...</p>
            ) : agendamentoAtivo ? (
              <div className={styles.highlightContent}>
                <strong>{agendamentoAtivo.nomeHemocentro}</strong>
                <span>
                  {formatarData(agendamentoAtivo.data)} às{" "}
                  {formatarHorario(agendamentoAtivo.horario)}
                </span>
                <small>{agendamentoAtivo.enderecoHemocentro}</small>
              </div>
            ) : (
              <p className={styles.emptyText}>
                Você não possui agendamentos ativos no momento.
              </p>
            )}

            <div className={styles.cardActions}>
              <Link to="/agendamentos" className={styles.secondaryLink}>
                Meus agendamentos
              </Link>

              <Link to="/agendamentos/novo" className={styles.primaryLink}>
                Novo agendamento
              </Link>
            </div>
          </article>

          <article className={styles.summaryCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🩸</span>
              <div>
                <h2>Campanhas e alertas</h2>
                <p>Campanha em destaque cadastrada pela unidade responsável.</p>
              </div>
            </div>

            {loading ? (
              <p className={styles.emptyText}>Carregando campanhas...</p>
            ) : campanhaDestaque ? (
              <div className={styles.highlightContent}>
                <strong>{campanhaDestaque.titulo}</strong>
                <span>
                  {formatarTiposSanguineos(
                    campanhaDestaque.tiposSanguineosNecessarios
                  )}{" "}
                  • Urgência {formatarUrgencia(campanhaDestaque.urgencia)}
                </span>
                <small>
                  {campanhaDestaque.hemocentroNome ||
                    campanhaDestaque.nomeHemocentro ||
                    "Unidade vinculada"}
                </small>
              </div>
            ) : (
              <p className={styles.emptyText}>
                Nenhuma campanha cadastrada no momento.
              </p>
            )}

            <div className={styles.cardActions}>
              <Link to="/campanhas" className={styles.primaryLink}>
                Ver campanhas
              </Link>

              {campanhaDestaque && (
                <Link
                  to={`/campanhas/${campanhaDestaque.id}`}
                  className={styles.secondaryLink}
                >
                  Detalhes
                </Link>
              )}
            </div>
          </article>
        </section>

        <section className={styles.quickActions}>
          <div className={styles.sectionTitle}>
            <h2>Ações rápidas</h2>
            <p>Acesse as principais funcionalidades do sistema.</p>
          </div>

          <div className={styles.actionGrid}>
            <Link to="/agendamentos/novo" className={styles.actionCard}>
              <strong>Novo agendamento</strong>
              <span>Escolha uma unidade, data e horário disponível.</span>
            </Link>

            <Link to="/agendamentos" className={styles.actionCard}>
              <strong>Meus agendamentos</strong>
              <span>Consulte, acompanhe ou cancele seus agendamentos.</span>
            </Link>

            <Link to="/campanhas" className={styles.actionCard}>
              <strong>Campanhas e alertas</strong>
              <span>Veja campanhas ativas e necessidades de estoque.</span>
            </Link>

            <Link to="/orientacoes" className={styles.actionCard}>
              <strong>Orientações</strong>
              <span>Consulte cuidados e informações antes da doação.</span>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;