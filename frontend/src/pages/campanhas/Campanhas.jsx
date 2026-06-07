import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import { campanhasService } from "../../services/api";
import styles from "./Campanhas.module.css";

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

function Campanhas() {
  const [campanhas, setCampanhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarCampanhas() {
      try {
        setLoading(true);
        setErro("");

        const dados = await campanhasService.listarCampanhas();
        setCampanhas(Array.isArray(dados) ? dados : []);
      } catch (error) {
        setErro(error.message || "Não foi possível carregar as campanhas.");
      } finally {
        setLoading(false);
      }
    }

    carregarCampanhas();
  }, []);

  function getUrgencyClass(urgencia) {
    if (urgencia === "CRITICA") return styles.urgencyHigh;
    if (urgencia === "ALTA") return styles.urgencyMedium;
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
            <p>
              Indicadores visuais de apoio. A integração principal desta etapa é
              com as campanhas cadastradas no backend.
            </p>
          </div>

          <div className={styles.stockGrid}>
            <article className={styles.stockCard}>
              <div className={styles.stockHeader}>
                <strong>O-</strong>
                <span className={styles.stockCritical}>Crítico</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={`${styles.progressFill} ${styles.stockCritical}`}
                  style={{ width: "18%" }}
                />
              </div>
              <p>18% do nível ideal</p>
            </article>

            <article className={styles.stockCard}>
              <div className={styles.stockHeader}>
                <strong>A+</strong>
                <span className={styles.stockWarning}>Alerta</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={`${styles.progressFill} ${styles.stockWarning}`}
                  style={{ width: "38%" }}
                />
              </div>
              <p>38% do nível ideal</p>
            </article>

            <article className={styles.stockCard}>
              <div className={styles.stockHeader}>
                <strong>B-</strong>
                <span className={styles.stockWarning}>Alerta</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={`${styles.progressFill} ${styles.stockWarning}`}
                  style={{ width: "42%" }}
                />
              </div>
              <p>42% do nível ideal</p>
            </article>

            <article className={styles.stockCard}>
              <div className={styles.stockHeader}>
                <strong>O+</strong>
                <span className={styles.stockStable}>Estável</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={`${styles.progressFill} ${styles.stockStable}`}
                  style={{ width: "72%" }}
                />
              </div>
              <p>72% do nível ideal</p>
            </article>
          </div>
        </section>

        <section className={styles.campaignSection}>
          <div className={styles.sectionTitle}>
            <h2>Campanhas Ativas</h2>
            <p>Campanhas recuperadas da API do backend.</p>
          </div>

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
              <h3>Nenhuma campanha cadastrada</h3>
              <p>
                Ainda não existem campanhas cadastradas no backend. Quando o
                administrador criar uma campanha, ela aparecerá aqui.
              </p>
            </div>
          )}

          {!loading && !erro && campanhas.length > 0 && (
            <div className={styles.campaignGrid}>
              {campanhas.map((campanha) => (
                <article key={campanha.id} className={styles.campaignCard}>
                  <div className={styles.campaignTop}>
                    <span className={styles.bloodType}>
                      {formatarTiposSanguineos(
                        campanha.tiposSanguineosNecessarios
                      )}
                    </span>

                    <span
                      className={`${styles.urgencyBadge} ${getUrgencyClass(
                        campanha.urgencia
                      )}`}
                    >
                      {formatarUrgencia(campanha.urgencia)}
                    </span>
                  </div>

                  <h3>{campanha.titulo}</h3>

                  <div className={styles.metaInfo}>
                    <span>Unidade responsável</span>
                    <strong>
                      {campanha.hemocentroNome ||
                        campanha.nomeHemocentro ||
                        "Unidade vinculada"}
                    </strong>
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
          )}
        </section>
      </main>
    </>
  );
}

export default Campanhas;