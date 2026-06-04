import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import styles from "./Agendamentos.module.css";

function Agendamentos() {
  const agendamentos = [
    {
      id: 1,
      dia: "15",
      mes: "JUN",
      unidade: "Hemoce Fortaleza",
      dataCompleta: "15/06/2026",
      horario: "14:00",
      status: "Confirmado",
    },
    {
      id: 2,
      dia: "15",
      mes: "OUT",
      unidade: "Unidade Sobral",
      dataCompleta: "15/10/2026",
      horario: "10:00",
      status: "Realizado",
    },
    {
      id: 3,
      dia: "10",
      mes: "OUT",
      unidade: "Unidade Crato",
      dataCompleta: "10/10/2026",
      horario: "16:00",
      status: "Cancelado",
    },
  ];

  function getStatusClass(status) {
    if (status === "Confirmado") return styles.statusConfirmed;
    if (status === "Realizado") return styles.statusDone;
    if (status === "Cancelado") return styles.statusCanceled;
    return "";
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
          {agendamentos.map((agendamento) => (
            <article key={agendamento.id} className={styles.appointmentCard}>
              <div className={styles.dateBox}>
                <strong>{agendamento.dia}</strong>
                <span>{agendamento.mes}</span>
              </div>

              <div className={styles.appointmentInfo}>
                <h2>{agendamento.unidade}</h2>
                <p>
                  {agendamento.dataCompleta} às {agendamento.horario}
                </p>
              </div>

              <div className={styles.actionsArea}>
                <span className={`${styles.statusBadge} ${getStatusClass(agendamento.status)}`}>
                  {agendamento.status}
                </span>

                <Link
                  to={`/agendamentos/${agendamento.id}`}
                  className={styles.detailsButton}
                >
                  Detalhes
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}

export default Agendamentos;