import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import styles from "./Home.module.css";

function Home() {
  return (
    <>
      <Header />

      <main className={styles.page}>
        <section className={styles.hero}>
          <div>
            <span className={styles.eyebrow}>Sistema de Apoio à Doação</span>
            <h1>Olá, João! O que deseja fazer hoje?</h1>
            <p>
              Acompanhe campanhas, consulte orientações e agende sua próxima
              doação de sangue de forma simples.
            </p>
          </div>
        </section>

        <section className={styles.cardsGrid}>
          <Link to="/agendamentos/novo" className={styles.card}>
            <span className={styles.cardTag}>Agendamento</span>
            <h2>Novo Agendamento</h2>
            <p>
              Escolha a unidade, data, horário e tipo sanguíneo para simular o
              agendamento da sua doação.
            </p>
          </Link>

          <Link to="/campanhas" className={styles.card}>
            <span className={styles.cardTag}>Campanhas</span>
            <h2>Campanhas e Alertas</h2>
            <p>
              Veja campanhas ativas e alertas de estoque baixo em unidades de
              doação.
            </p>
          </Link>

          <Link to="/agendamentos" className={styles.card}>
            <span className={styles.cardTag}>Consulta</span>
            <h2>Meus Agendamentos</h2>
            <p>
              Consulte uma lista mockada de agendamentos para visualizar o fluxo
              da tela.
            </p>
          </Link>
        </section>
      </main>
    </>
  );
}

export default Home;