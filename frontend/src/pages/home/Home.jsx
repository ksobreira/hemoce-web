import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import styles from "./Home.module.css";

function Home() {
  const proximoAgendamento = {
    id: 1,
    data: "15 de Junho, 2026",
    horario: "14:00h",
    unidade: "Hemoce - Unidade Central",
    status: "Confirmado",
  };

  const campanhasAtivas = [
    {
      id: 1,
      titulo: "Junho Vermelho",
      subtitulo: "Todos os tipos sanguíneos",
      destaque: "media",
    },
    {
      id: 2,
      titulo: "Estoque crítico: O-",
      subtitulo: "Hemoce Fortaleza",
      destaque: "alta",
    },
  ];

  const acoesRapidas = [
    {
      titulo: "Agendar Doação",
      descricao: "Escolha unidade, data e horário para sua próxima doação.",
      icone: "💧",
      rota: "/agendamentos/novo",
    },
    {
      titulo: "Meus Agendamentos",
      descricao: "Consulte seus agendamentos simulados e histórico de doações.",
      icone: "📅",
      rota: "/agendamentos",
    },
    {
      titulo: "Campanhas e Alertas",
      descricao: "Veja estoques baixos e campanhas ativas dos hemocentros.",
      icone: "🚨",
      rota: "/campanhas",
    },
    {
      titulo: "Orientações",
      descricao: "Acesse informações importantes antes de doar sangue.",
      icone: "📄",
      rota: "/orientacoes",
    },
  ];

  return (
    <>
      <Header />

      <main className={styles.page}>
        <section className={styles.welcomeSection}>
          <h1>Olá, João Silva!</h1>
          <p>Que bom ter você aqui. Seu sangue salva vidas.</p>
        </section>

        <section className={styles.summaryGrid}>
          <article className={styles.summaryCard}>
            <div className={styles.cardHeader}>
              <h2>Próximo Agendamento</h2>
              <span className={styles.statusConfirmed}>
                {proximoAgendamento.status}
              </span>
            </div>

            <div className={styles.appointmentInfo}>
              <div className={styles.infoRow}>
                <span className={styles.infoIcon}>📅</span>
                <div>
                  <span className={styles.infoLabel}>Data e hora</span>
                  <strong>
                    {proximoAgendamento.data} às {proximoAgendamento.horario}
                  </strong>
                </div>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoIcon}>📍</span>
                <div>
                  <span className={styles.infoLabel}>Local</span>
                  <strong>{proximoAgendamento.unidade}</strong>
                </div>
              </div>
            </div>

            <Link
              to={`/agendamentos/${proximoAgendamento.id}`}
              className={styles.outlineButton}
            >
              Ver detalhes
            </Link>
          </article>

          <article className={styles.summaryCard}>
            <div className={styles.cardHeader}>
              <h2>Campanhas Ativas</h2>
            </div>

            <div className={styles.campaignList}>
              {campanhasAtivas.map((campanha) => (
                <Link
                  key={campanha.id}
                  to={`/campanhas/${campanha.id}`}
                  className={`${styles.campaignItem} ${
                    campanha.destaque === "alta"
                      ? styles.highPriority
                      : styles.mediumPriority
                  }`}
                >
                  <div>
                    <strong>{campanha.titulo}</strong>
                    <span>{campanha.subtitulo}</span>
                  </div>
                </Link>
              ))}
            </div>

            <Link to="/campanhas" className={styles.textButton}>
              Ver todas as campanhas →
            </Link>
          </article>
        </section>

        <section className={styles.quickActionsSection}>
          <h2>O que você deseja fazer?</h2>

          <div className={styles.quickActionsGrid}>
            {acoesRapidas.map((acao) => (
              <Link key={acao.titulo} to={acao.rota} className={styles.actionCard}>
                <span className={styles.actionIcon}>{acao.icone}</span>
                <h3>{acao.titulo}</h3>
                <p>{acao.descricao}</p>
                <span className={styles.actionHint}>Acessar →</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;