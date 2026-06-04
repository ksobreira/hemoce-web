import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import styles from "./DetalhesCampanhas.module.css";

function DetalhesCampanhas() {
  const navigate = useNavigate();
  const { id } = useParams();

  const campanhasMockadas = [
    {
      id: "1",
      titulo: "Estoque baixo para O-",
      tipoSanguineo: "O-",
      unidade: "Hemoce Fortaleza",
      periodo: "01/06/2026 a 30/06/2026",
      urgencia: "Alta",
      descricao:
        "Campanha voltada para reforçar o estoque de sangue O negativo, um dos tipos mais importantes em situações de emergência por ser considerado doador universal para hemácias.",
      orientacao:
        "Doadores com tipo sanguíneo O- são incentivados a realizar agendamento o quanto antes, especialmente na unidade de Fortaleza.",
    },
    {
      id: "2",
      titulo: "Campanha Semana Solidária",
      tipoSanguineo: "Todos os tipos",
      unidade: "Unidade Sobral",
      periodo: "10/06/2026 a 17/06/2026",
      urgencia: "Média",
      descricao:
        "Ação especial para incentivar doações durante a semana, buscando aumentar o número de voluntários e manter os estoques em níveis seguros.",
      orientacao:
        "Todos os tipos sanguíneos são bem-vindos. A campanha busca ampliar a participação da comunidade local.",
    },
    {
      id: "3",
      titulo: "Alerta para tipo A+",
      tipoSanguineo: "A+",
      unidade: "Unidade Crato",
      periodo: "05/06/2026 a 20/06/2026",
      urgencia: "Média",
      descricao:
        "Campanha criada para reforçar o estoque de sangue A positivo, que apresentou redução nos últimos dias.",
      orientacao:
        "Doadores A+ podem contribuir diretamente para estabilizar o estoque da unidade.",
    },
    {
      id: "4",
      titulo: "Reforço de estoque no interior",
      tipoSanguineo: "B-",
      unidade: "Unidade Iguatu",
      periodo: "01/06/2026 a 25/06/2026",
      urgencia: "Alta",
      descricao:
        "Campanha voltada para aumentar as doações nas unidades do interior, especialmente para tipos sanguíneos com menor disponibilidade.",
      orientacao:
        "A unidade de Iguatu está priorizando doadores B-, mas outros tipos também podem contribuir.",
    },
  ];

  const campanha =
    campanhasMockadas.find((item) => item.id === id) || campanhasMockadas[0];

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
          <button className={styles.backButton} onClick={() => navigate("/campanhas")}>
            ← Voltar
          </button>

          <div>
            <span className={styles.eyebrow}>Detalhes da campanha</span>
            <h1>{campanha.titulo}</h1>
            <p>Veja as informações completas da campanha ou alerta selecionado.</p>
          </div>
        </section>

        <section className={styles.contentGrid}>
          <article className={styles.detailsCard}>
            <div className={styles.cardHeader}>
              <div>
                <span className={styles.bloodType}>{campanha.tipoSanguineo}</span>
                <h2>{campanha.titulo}</h2>
              </div>

              <span
                className={`${styles.urgencyBadge} ${getUrgencyClass(
                  campanha.urgencia
                )}`}
              >
                Urgência {campanha.urgencia}
              </span>
            </div>

            <div className={styles.descriptionArea}>
              <h3>Descrição completa</h3>
              <p>{campanha.descricao}</p>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span>Tipo sanguíneo necessário</span>
                <strong>{campanha.tipoSanguineo}</strong>
              </div>

              <div className={styles.infoItem}>
                <span>Unidade responsável</span>
                <strong>{campanha.unidade}</strong>
              </div>

              <div className={styles.infoItem}>
                <span>Período da campanha</span>
                <strong>{campanha.periodo}</strong>
              </div>

              <div className={styles.infoItem}>
                <span>Nível de urgência</span>
                <strong>{campanha.urgencia}</strong>
              </div>
            </div>

            <div className={styles.orientationBox}>
              <strong>Orientação ao doador</strong>
              <p>{campanha.orientacao}</p>
            </div>

            <div className={styles.actions}>
              <button className={styles.secondaryButton} onClick={() => navigate("/campanhas")}>
                Voltar
              </button>

              <Link to="/agendamentos/novo" className={styles.primaryButton}>
                Agendar doação
              </Link>
            </div>
          </article>

          <aside className={styles.sideCard}>
            <h2>Por que isso importa?</h2>
            <p>
              Alertas de estoque ajudam o doador a entender quais tipos sanguíneos
              estão com maior necessidade no momento.
            </p>

            <div className={styles.mockNotice}>
              <strong>Dados mockados</strong>
              <p>
                Esta tela usa informações fictícias para simular como uma campanha
                real seria exibida após integração com banco de dados ou API.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}

export default DetalhesCampanhas;