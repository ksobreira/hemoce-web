import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import styles from "./Campanhas.module.css";

function Campanhas() {
  const estoques = [
    { tipo: "O-", nivel: "Crítico", percentual: 18, status: "critico" },
    { tipo: "A+", nivel: "Alerta", percentual: 38, status: "alerta" },
    { tipo: "B-", nivel: "Alerta", percentual: 42, status: "alerta" },
    { tipo: "O+", nivel: "Estável", percentual: 72, status: "estavel" },
  ];

  const campanhas = [
    {
      id: 1,
      titulo: "Estoque baixo para O-",
      tipoSanguineo: "O-",
      unidade: "Hemoce Fortaleza",
      urgencia: "Alta",
      descricao: "Campanha para reforço do estoque de sangue O negativo.",
    },
    {
      id: 2,
      titulo: "Campanha Semana Solidária",
      tipoSanguineo: "Todos os tipos",
      unidade: "Unidade Sobral",
      urgencia: "Média",
      descricao: "Ação especial para incentivar doações durante a semana.",
    },
    {
      id: 3,
      titulo: "Alerta para tipo A+",
      tipoSanguineo: "A+",
      unidade: "Unidade Crato",
      urgencia: "Média",
      descricao: "O estoque de A positivo precisa de reforço nos próximos dias.",
    },
    {
      id: 4,
      titulo: "Reforço de estoque no interior",
      tipoSanguineo: "B-",
      unidade: "Unidade Iguatu",
      urgencia: "Alta",
      descricao: "Campanha voltada para aumentar as doações nas unidades do interior.",
    },
  ];

  function getStockClass(status) {
    if (status === "critico") return styles.stockCritical;
    if (status === "alerta") return styles.stockWarning;
    if (status === "estavel") return styles.stockStable;
    return "";
  }

  function getUrgencyClass(urgencia) {
    if (urgencia === "Alta") return styles.urgencyHigh;
    if (urgencia === "Média") return styles.urgencyMedium;
    return styles.urgencyLow;
  }

  return (
    <>
      <Header />

      <main className={styles.page}>
        <section className={styles.pageHeader}>
          <div>
            <span className={styles.eyebrow}>Doação de sangue</span>
            <h1>Campanhas e Alertas</h1>
            <p>
              Acompanhe campanhas ativas e alertas de estoque baixo nas unidades
              de doação.
            </p>
          </div>
        </section>

        <section className={styles.stockSection}>
          <div className={styles.sectionTitle}>
            <h2>Níveis de Estoque</h2>
            <p>Indicadores mockados para simular a necessidade por tipo sanguíneo.</p>
          </div>

          <div className={styles.stockGrid}>
            {estoques.map((estoque) => (
              <article key={estoque.tipo} className={styles.stockCard}>
                <div className={styles.stockHeader}>
                  <strong>{estoque.tipo}</strong>
                  <span className={getStockClass(estoque.status)}>
                    {estoque.nivel}
                  </span>
                </div>

                <div className={styles.progressBar}>
                  <div
                    className={`${styles.progressFill} ${getStockClass(
                      estoque.status
                    )}`}
                    style={{ width: `${estoque.percentual}%` }}
                  />
                </div>

                <p>{estoque.percentual}% do nível ideal</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.campaignSection}>
          <div className={styles.sectionTitle}>
            <h2>Campanhas Ativas</h2>
            <p>Cards com campanhas e alertas disponíveis para o doador.</p>
          </div>

          <div className={styles.campaignGrid}>
            {campanhas.map((campanha) => (
              <article key={campanha.id} className={styles.campaignCard}>
                <div className={styles.campaignTop}>
                  <span className={styles.bloodType}>
                    {campanha.tipoSanguineo}
                  </span>

                  <span
                    className={`${styles.urgencyBadge} ${getUrgencyClass(
                      campanha.urgencia
                    )}`}
                  >
                    {campanha.urgencia}
                  </span>
                </div>

                <h3>{campanha.titulo}</h3>

                <div className={styles.metaInfo}>
                  <span>Unidade responsável</span>
                  <strong>{campanha.unidade}</strong>
                </div>

                <p>{campanha.descricao}</p>

                <div className={styles.cardActions}>
                  <Link
                    to={`/campanhas/${campanha.id}`}
                    className={styles.secondaryButton}
                  >
                    Ver detalhes
                  </Link>

                  <Link to="/agendamentos/novo" className={styles.primaryButton}>
                    Agendar doação
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default Campanhas;