import React, { useEffect, useMemo, useState } from "react";
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

function montarTiposEmDestaque(campanhas) {
  const prioridade = {
    CRITICA: 3,
    ALTA: 2,
    NORMAL: 1,
  };

  const tipos = new Map();

  campanhas.forEach((campanha) => {
    const urgenciaAtual = campanha.urgencia || "NORMAL";

    (campanha.tiposSanguineosNecessarios || []).forEach((tipo) => {
      const itemAtual = tipos.get(tipo);

      if (!itemAtual || prioridade[urgenciaAtual] > prioridade[itemAtual.urgencia]) {
        tipos.set(tipo, {
          tipo,
          urgencia: urgenciaAtual,
          campanha: campanha.titulo,
        });
      }
    });
  });

  return Array.from(tipos.values())
    .sort((a, b) => prioridade[b.urgencia] - prioridade[a.urgencia])
    .slice(0, 4);
}

function Campanhas() {
  const [campanhas, setCampanhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const tiposEmDestaque = useMemo(
    () => montarTiposEmDestaque(campanhas),
    [campanhas]
  );

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
            <h2>Tipos sanguíneos em destaque</h2>
            <p>
              Indicadores baseados nos tipos sanguíneos solicitados nas campanhas
              ativas.
            </p>
          </div>

          {loading && (
            <div className={styles.feedbackBox}>
              <p>Carregando indicadores das campanhas...</p>
            </div>
          )}

          {!loading && tiposEmDestaque.length === 0 && (
            <div className={styles.feedbackBox}>
              <p>
                Nenhum tipo sanguíneo em destaque no momento. Quando houver
                campanhas ativas com tipos solicitados, eles aparecerão aqui.
              </p>
            </div>
          )}

          {!loading && tiposEmDestaque.length > 0 && (
            <div className={styles.stockGrid}>
              {tiposEmDestaque.map((item) => (
                <article key={item.tipo} className={styles.stockCard}>
                  <div className={styles.stockHeader}>
                    <strong>{formatarTipoSanguineo(item.tipo)}</strong>
                    <span className={getUrgencyClass(item.urgencia)}>
                      {item.urgencia === "CRITICA"
                        ? "Necessidade crítica"
                        : "Prioridade da campanha"}
                    </span>
                  </div>
                  <p>{item.campanha || "Campanha ativa"}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className={styles.campaignSection}>
          <div className={styles.sectionTitle}>
            <h2>Campanhas Ativas</h2>
            <p>Campanhas disponíveis para consulta no sistema.</p>
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
                Ainda não existem campanhas cadastradas. Quando o administrador
                criar uma campanha, ela aparecerá aqui.
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
