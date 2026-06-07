import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import { agendamentosService } from "../../services/api";
import styles from "./DetalhesAgendamento.module.css";

function formatarData(data) {
  if (!data) return "Data não informada";

  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function formatarHorario(horario) {
  if (!horario) return "--:--";
  return horario.slice(0, 5);
}

function formatarStatus(status) {
  const mapa = {
    PENDENTE: "Pendente",
    CONFIRMADO: "Confirmado",
    CANCELADO: "Cancelado",
    CONCLUIDO: "Concluído",
  };

  return mapa[status] || status || "Não informado";
}

function DetalhesAgendamento() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [agendamento, setAgendamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarAgendamento() {
      try {
        setLoading(true);
        setErro("");

        const dados = await agendamentosService.listarAgendamentos();
        const lista = Array.isArray(dados) ? dados : [];

        const agendamentoEncontrado = lista.find(
          (item) => String(item.id) === String(id)
        );

        if (!agendamentoEncontrado) {
          setErro("Agendamento não encontrado.");
          setAgendamento(null);
          return;
        }

        setAgendamento(agendamentoEncontrado);
      } catch (error) {
        setErro(error.message || "Não foi possível carregar o agendamento.");
      } finally {
        setLoading(false);
      }
    }

    carregarAgendamento();
  }, [id]);

  function getStatusClass(status) {
    if (status === "CONFIRMADO") return styles.statusConfirmed;
    if (status === "CONCLUIDO") return styles.statusDone;
    if (status === "CANCELADO") return styles.statusCanceled;
    if (status === "PENDENTE") return styles.statusPending;
    return "";
  }

  async function handleCancelamento() {
    const confirmou = window.confirm(
      "Tem certeza que deseja cancelar este agendamento?"
    );

    if (!confirmou || !agendamento) {
      return;
    }

    try {
      await agendamentosService.cancelarAgendamento(agendamento.id);
      alert("Agendamento cancelado com sucesso.");
      navigate("/agendamentos");
    } catch (error) {
      alert(error.message || "Não foi possível cancelar o agendamento.");
    }
  }

  return (
    <>
      <Header />

      <main className={styles.page}>
        <section className={styles.pageHeader}>
          <button className={styles.backButton} onClick={() => navigate("/agendamentos")}>
            ← Voltar
          </button>

          <div>
            <span className={styles.eyebrow}>Detalhes do agendamento</span>
            <h1>{agendamento?.nomeHemocentro || "Agendamento"}</h1>
            <p>Confira as informações do agendamento selecionado.</p>
          </div>
        </section>

        {loading && (
          <section className={styles.singleMessage}>
            <p>Carregando detalhes do agendamento...</p>
          </section>
        )}

        {erro && (
          <section className={styles.singleError}>
            <p>{erro}</p>
          </section>
        )}

        {!loading && !erro && agendamento && (
          <section className={styles.contentGrid}>
            <article className={styles.detailsCard}>
              <div className={styles.cardHeader}>
                <h2>Informações do agendamento</h2>
                <span
                  className={`${styles.statusBadge} ${getStatusClass(
                    agendamento.status
                  )}`}
                >
                  {formatarStatus(agendamento.status)}
                </span>
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span>Unidade</span>
                  <strong>{agendamento.nomeHemocentro}</strong>
                </div>

                <div className={styles.infoItem}>
                  <span>Endereço</span>
                  <strong>{agendamento.enderecoHemocentro}</strong>
                </div>

                <div className={styles.infoItem}>
                  <span>Data</span>
                  <strong>{formatarData(agendamento.data)}</strong>
                </div>

                <div className={styles.infoItem}>
                  <span>Horário</span>
                  <strong>{formatarHorario(agendamento.horario)}</strong>
                </div>

                <div className={styles.infoItem}>
                  <span>Status</span>
                  <strong>{formatarStatus(agendamento.status)}</strong>
                </div>

                <div className={styles.infoItem}>
                  <span>Identificador</span>
                  <strong>#{agendamento.id}</strong>
                </div>
              </div>

              <div className={styles.actions}>
                {agendamento.status !== "CANCELADO" &&
                  agendamento.status !== "CONCLUIDO" && (
                    <button
                      className={styles.secondaryButton}
                      onClick={handleCancelamento}
                    >
                      Cancelar agendamento
                    </button>
                  )}

                <Link to="/agendamentos/novo" className={styles.primaryButton}>
                  Novo agendamento
                </Link>
              </div>
            </article>

            <aside className={styles.sideCard}>
              <h2>Orientações rápidas</h2>

              <ul>
                <li>Chegue com alguns minutos de antecedência.</li>
                <li>Leve documento oficial com foto.</li>
                <li>Evite alimentos gordurosos antes da doação.</li>
                <li>Informe qualquer sintoma recente durante a triagem.</li>
              </ul>
            </aside>
          </section>
        )}
      </main>
    </>
  );
}

export default DetalhesAgendamento;