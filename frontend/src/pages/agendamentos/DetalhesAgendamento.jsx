import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import styles from "./DetalhesAgendamento.module.css";

function DetalhesAgendamento() {
  const navigate = useNavigate();
  const { id } = useParams();

  const agendamentosMockados = [
    {
      id: "1",
      unidade: "Hemoce Fortaleza",
      endereco: "Av. José Bastos, 3390 - Rodolfo Teófilo, Fortaleza - CE",
      data: "15/06/2026",
      horario: "14:00",
      tipoSanguineo: "O+",
      status: "Confirmado",
      observacoes: "Doação voluntária agendada pelo sistema.",
    },
    {
      id: "2",
      unidade: "Unidade Sobral",
      endereco: "Rua Jânio Quadros, S/N - Sobral - CE",
      data: "15/10/2026",
      horario: "10:00",
      tipoSanguineo: "A+",
      status: "Realizado",
      observacoes: "Agendamento já realizado.",
    },
    {
      id: "3",
      unidade: "Unidade Crato",
      endereco: "Rua Coronel Antônio Luiz, 1111 - Crato - CE",
      data: "10/10/2026",
      horario: "16:00",
      tipoSanguineo: "B+",
      status: "Cancelado",
      observacoes: "Agendamento cancelado pelo usuário.",
    },
  ];

  const agendamento =
    agendamentosMockados.find((item) => item.id === id) || agendamentosMockados[0];

  function getStatusClass(status) {
    if (status === "Confirmado") return styles.statusConfirmed;
    if (status === "Realizado") return styles.statusDone;
    if (status === "Cancelado") return styles.statusCanceled;
    return "";
  }

  function handleCancelamento() {
    alert(
      "Cancelamento simulado. Nesta etapa, nenhuma alteração é salva no banco de dados."
    );
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
            <h1>{agendamento.unidade}</h1>
            <p>Confira as informações do agendamento selecionado.</p>
          </div>
        </section>

        <section className={styles.contentGrid}>
          <article className={styles.detailsCard}>
            <div className={styles.cardHeader}>
              <h2>Informações do agendamento</h2>
              <span className={`${styles.statusBadge} ${getStatusClass(agendamento.status)}`}>
                {agendamento.status}
              </span>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span>Unidade</span>
                <strong>{agendamento.unidade}</strong>
              </div>

              <div className={styles.infoItem}>
                <span>Endereço</span>
                <strong>{agendamento.endereco}</strong>
              </div>

              <div className={styles.infoItem}>
                <span>Data</span>
                <strong>{agendamento.data}</strong>
              </div>

              <div className={styles.infoItem}>
                <span>Horário</span>
                <strong>{agendamento.horario}</strong>
              </div>

              <div className={styles.infoItem}>
                <span>Tipo sanguíneo informado</span>
                <strong>{agendamento.tipoSanguineo}</strong>
              </div>

              <div className={styles.infoItem}>
                <span>Observações</span>
                <strong>{agendamento.observacoes}</strong>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.secondaryButton} onClick={handleCancelamento}>
                Cancelar agendamento
              </button>

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

            <div className={styles.mockNotice}>
              <strong>Dados mockados</strong>
              <p>
                Esta página simula os detalhes de um agendamento. Futuramente, os
                dados serão carregados pelo ID vindo da rota.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}

export default DetalhesAgendamento;