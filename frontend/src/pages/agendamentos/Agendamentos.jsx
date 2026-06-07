import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import { agendamentosService } from "../../services/api";
import styles from "./Agendamentos.module.css";

function formatarData(data) {
  if (!data) return "Data não informada";

  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function obterDia(data) {
  if (!data) return "--";

  const [, , dia] = data.split("-");
  return dia;
}

function obterMes(data) {
  if (!data) return "---";

  const [, mes] = data.split("-");

  const meses = {
    "01": "JAN",
    "02": "FEV",
    "03": "MAR",
    "04": "ABR",
    "05": "MAI",
    "06": "JUN",
    "07": "JUL",
    "08": "AGO",
    "09": "SET",
    "10": "OUT",
    "11": "NOV",
    "12": "DEZ",
  };

  return meses[mes] || "---";
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

function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarAgendamentos() {
    try {
      setLoading(true);
      setErro("");

      const dados = await agendamentosService.listarAgendamentos();
      setAgendamentos(Array.isArray(dados) ? dados : []);
    } catch (error) {
      setErro(error.message || "Não foi possível carregar os agendamentos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  function getStatusClass(status) {
    if (status === "CONFIRMADO") return styles.statusConfirmed;
    if (status === "CONCLUIDO") return styles.statusDone;
    if (status === "CANCELADO") return styles.statusCanceled;
    if (status === "PENDENTE") return styles.statusPending;
    return "";
  }

  async function handleCancelarAgendamento(id) {
    const confirmou = window.confirm(
      "Tem certeza que deseja cancelar este agendamento?"
    );

    if (!confirmou) {
      return;
    }

    try {
      await agendamentosService.cancelarAgendamento(id);
      await carregarAgendamentos();
    } catch (error) {
      alert(error.message || "Não foi possível cancelar o agendamento.");
    }
  }

  return (
    <>
      <Header />

      <main className={styles.page}>
        <section className={styles.pageHeader}>
          <div>
            <h1>Meus Agendamentos</h1>
            <p>Gerencie suas doações marcadas e seu histórico.</p>
          </div>

          <Link to="/agendamentos/novo" className={styles.primaryButton}>
            + Agendar Doação
          </Link>
        </section>

        <section className={styles.list}>
          {loading && (
            <div className={styles.feedbackBox}>
              <p>Carregando agendamentos...</p>
            </div>
          )}

          {erro && (
            <div className={styles.errorBox}>
              <p>{erro}</p>
            </div>
          )}

          {!loading && !erro && agendamentos.length === 0 && (
            <div className={styles.feedbackBox}>
              <h2>Nenhum agendamento encontrado</h2>
              <p>
                Você ainda não possui agendamentos cadastrados. Clique em
                “Agendar Doação” para escolher uma unidade, data e horário.
              </p>
            </div>
          )}

          {!loading &&
            !erro &&
            agendamentos.map((agendamento) => (
              <article key={agendamento.id} className={styles.appointmentCard}>
                <div className={styles.dateBox}>
                  <strong>{obterDia(agendamento.data)}</strong>
                  <span>{obterMes(agendamento.data)}</span>
                </div>

                <div className={styles.appointmentInfo}>
                  <h2>{agendamento.nomeHemocentro}</h2>
                  <p>
                    {formatarData(agendamento.data)} às{" "}
                    {formatarHorario(agendamento.horario)}
                  </p>
                  <small>{agendamento.enderecoHemocentro}</small>
                </div>

                <div className={styles.actionsArea}>
                  <span
                    className={`${styles.statusBadge} ${getStatusClass(
                      agendamento.status
                    )}`}
                  >
                    {formatarStatus(agendamento.status)}
                  </span>

                  <Link
                    to={`/agendamentos/${agendamento.id}`}
                    className={styles.detailsButton}
                  >
                    Detalhes
                  </Link>

                  {agendamento.status !== "CANCELADO" &&
                    agendamento.status !== "CONCLUIDO" && (
                      <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={() => handleCancelarAgendamento(agendamento.id)}
                      >
                        Cancelar
                      </button>
                    )}
                </div>
              </article>
            ))}
        </section>
      </main>
    </>
  );
}

export default Agendamentos;