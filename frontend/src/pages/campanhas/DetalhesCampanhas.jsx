import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import { campanhasService } from "../../services/api";
import styles from "./DetalhesCampanhas.module.css";

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

function formatarStatus(status) {
  const mapa = {
    AGENDADA: "Agendada",
    ATIVA: "Ativa",
    ENCERRADA: "Encerrada",
  };

  return mapa[status] || status || "Não informado";
}

function formatarData(data) {
  if (!data) {
    return "Não informada";
  }

  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function DetalhesCampanhas() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [campanha, setCampanha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarCampanha() {
      try {
        setLoading(true);
        setErro("");

        const dados = await campanhasService.buscarCampanhaPorId(id);
        setCampanha(dados);
      } catch (error) {
        setErro(error.message || "Não foi possível carregar os detalhes da campanha.");
      } finally {
        setLoading(false);
      }
    }

    carregarCampanha();
  }, [id]);

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
          <button className={styles.backButton} onClick={() => navigate("/campanhas")}>
            ← Voltar
          </button>

          <div>
            <span className={styles.eyebrow}>Detalhes da campanha</span>
            <h1>{campanha?.titulo || "Campanha"}</h1>
            <p>Veja as informações completas da campanha ou alerta selecionado.</p>
          </div>
        </section>

        {loading && (
          <section className={styles.singleMessage}>
            <p>Carregando detalhes da campanha...</p>
          </section>
        )}

        {erro && (
          <section className={styles.singleError}>
            <p>{erro}</p>
          </section>
        )}

        {!loading && !erro && campanha && (
          <section className={styles.contentGrid}>
            <article className={styles.detailsCard}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.bloodType}>
                    {formatarTiposSanguineos(campanha.tiposSanguineosNecessarios)}
                  </span>
                  <h2>{campanha.titulo}</h2>
                </div>

                <span
                  className={`${styles.urgencyBadge} ${getUrgencyClass(
                    campanha.urgencia
                  )}`}
                >
                  Urgência {formatarUrgencia(campanha.urgencia)}
                </span>
              </div>

              <div className={styles.descriptionArea}>
                <h3>Descrição completa</h3>
                <p>{campanha.descricao || "Sem descrição cadastrada."}</p>
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span>Tipo sanguíneo necessário</span>
                  <strong>
                    {formatarTiposSanguineos(campanha.tiposSanguineosNecessarios)}
                  </strong>
                </div>

                <div className={styles.infoItem}>
                  <span>Unidade responsável</span>
                  <strong>
                    {campanha.hemocentroNome ||
                      campanha.nomeHemocentro ||
                      "Unidade vinculada"}
                  </strong>
                </div>

                <div className={styles.infoItem}>
                  <span>Período da campanha</span>
                  <strong>
                    {formatarData(campanha.dataInicio)} a{" "}
                    {formatarData(campanha.dataFim)}
                  </strong>
                </div>

                <div className={styles.infoItem}>
                  <span>Nível de urgência</span>
                  <strong>{formatarUrgencia(campanha.urgencia)}</strong>
                </div>

                <div className={styles.infoItem}>
                  <span>Status</span>
                  <strong>{formatarStatus(campanha.status)}</strong>
                </div>

                <div className={styles.infoItem}>
                  <span>Localidade</span>
                  <strong>
                    {campanha.cidade || "Cidade não informada"}
                    {campanha.estado ? ` - ${campanha.estado}` : ""}
                  </strong>
                </div>
              </div>

              <div className={styles.orientationBox}>
                <strong>Orientação ao doador</strong>
                <p>
                  Caso você seja compatível com os tipos sanguíneos solicitados,
                  agende uma doação na unidade responsável ou acompanhe as
                  orientações do hemocentro.
                </p>
              </div>

              <div className={styles.actions}>
                <button
                  className={styles.secondaryButton}
                  onClick={() => navigate("/campanhas")}
                >
                  Voltar
                </button>

                <Link to="/agendamentos/novo" className={styles.primaryButton}>
                  Agendar doação
                </Link>
              </div>
            </article>

            <aside className={styles.sideCard}>
              <h2>Por que essa campanha é importante?</h2>
              <p>
                Esta campanha destaca tipos sanguíneos que precisam de atenção
                no momento. Sua doação pode ajudar a reforçar o atendimento da
                unidade responsável.
              </p>

              <div className={styles.infoNotice}>
                <strong>Como você pode ajudar</strong>
                <p>
                  Verifique se você atende às orientações de doação e escolha um
                  horário disponível para contribuir com a campanha.
                </p>
              </div>
            </aside>
          </section>
        )}
      </main>
    </>
  );
}

export default DetalhesCampanhas;
