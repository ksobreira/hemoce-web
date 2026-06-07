import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import { agendamentosService, hemocentrosService } from "../../services/api";
import styles from "./NovoAgendamento.module.css";

function formatarHorario(hora) {
  if (!hora) return "--:--";
  return hora.slice(0, 5);
}

function NovoAgendamento() {
  const navigate = useNavigate();

  const [hemocentros, setHemocentros] = useState([]);
  const [horarios, setHorarios] = useState([]);

  const [hemocentroId, setHemocentroId] = useState("");
  const [data, setData] = useState("");
  const [horarioId, setHorarioId] = useState("");

  const [loadingHemocentros, setLoadingHemocentros] = useState(true);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [erro, setErro] = useState("");
  const [erroHorarios, setErroHorarios] = useState("");

  useEffect(() => {
    async function carregarHemocentros() {
      try {
        setLoadingHemocentros(true);
        setErro("");

        const dados = await hemocentrosService.listarHemocentros();
        setHemocentros(Array.isArray(dados) ? dados : []);
      } catch (error) {
        setErro(error.message || "Não foi possível carregar as unidades.");
      } finally {
        setLoadingHemocentros(false);
      }
    }

    carregarHemocentros();
  }, []);

  useEffect(() => {
    async function carregarHorarios() {
      if (!hemocentroId || !data) {
        setHorarios([]);
        setHorarioId("");
        return;
      }

      try {
        setLoadingHorarios(true);
        setErroHorarios("");
        setHorarioId("");

        const dados = await hemocentrosService.listarHorariosPorData(
          hemocentroId,
          data
        );

        const horariosDisponiveis = Array.isArray(dados)
          ? dados.filter((horario) => horario.disponivel && horario.vagas > 0)
          : [];

        setHorarios(horariosDisponiveis);
      } catch (error) {
        setErroHorarios(
          error.message || "Não foi possível carregar os horários disponíveis."
        );
      } finally {
        setLoadingHorarios(false);
      }
    }

    carregarHorarios();
  }, [hemocentroId, data]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!horarioId) {
      setErro("Selecione um horário disponível.");
      return;
    }

    try {
      setSalvando(true);
      setErro("");

      await agendamentosService.criarAgendamento(Number(horarioId));

      alert("Agendamento criado com sucesso!");
      navigate("/agendamentos");
    } catch (error) {
      setErro(error.message || "Não foi possível criar o agendamento.");
    } finally {
      setSalvando(false);
    }
  }

  function handleCancel() {
    navigate("/agendamentos");
  }

  return (
    <>
      <Header />

      <main className={styles.page}>
        <section className={styles.pageHeader}>
          <div>
            <span className={styles.eyebrow}>Agendamento de doação</span>
            <h1>Novo Agendamento</h1>
            <p>
              Escolha uma unidade, uma data e um horário disponível para marcar
              sua doação.
            </p>
          </div>
        </section>

        <section className={styles.contentGrid}>
          <form className={styles.formCard} onSubmit={handleSubmit}>
            {erro && <div className={styles.errorBox}>{erro}</div>}

            <div className={styles.formGroup}>
              <label htmlFor="hemocentroId">Unidade de doação</label>

              {loadingHemocentros ? (
                <p className={styles.helpText}>Carregando unidades...</p>
              ) : (
                <select
                  id="hemocentroId"
                  name="hemocentroId"
                  value={hemocentroId}
                  onChange={(event) => setHemocentroId(event.target.value)}
                  required
                >
                  <option value="">Selecione uma unidade</option>
                  {hemocentros.map((hemocentro) => (
                    <option key={hemocentro.id} value={hemocentro.id}>
                      {hemocentro.nome} - {hemocentro.cidade}
                    </option>
                  ))}
                </select>
              )}

              {!loadingHemocentros && hemocentros.length === 0 && (
                <p className={styles.errorText}>
                  Nenhuma unidade disponível para agendamento.
                </p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="data">Data</label>
              <input
                id="data"
                name="data"
                type="date"
                value={data}
                onChange={(event) => setData(event.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="horarioId">Horário disponível</label>

              {!hemocentroId || !data ? (
                <p className={styles.helpText}>
                  Selecione uma unidade e uma data para carregar os horários.
                </p>
              ) : loadingHorarios ? (
                <p className={styles.helpText}>Carregando horários...</p>
              ) : erroHorarios ? (
                <p className={styles.errorText}>{erroHorarios}</p>
              ) : (
                <select
                  id="horarioId"
                  name="horarioId"
                  value={horarioId}
                  onChange={(event) => setHorarioId(event.target.value)}
                  required
                >
                  <option value="">Selecione um horário</option>
                  {horarios.map((horario) => (
                    <option key={horario.id} value={horario.id}>
                      {formatarHorario(horario.hora)} — {horario.vagas} vaga(s)
                    </option>
                  ))}
                </select>
              )}

              {hemocentroId &&
                data &&
                !loadingHorarios &&
                !erroHorarios &&
                horarios.length === 0 && (
                  <p className={styles.errorText}>
                    Nenhum horário disponível para essa unidade nesta data.
                  </p>
                )}
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={handleCancel}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className={styles.primaryButton}
                disabled={salvando || !horarioId}
              >
                {salvando ? "Confirmando..." : "Confirmar agendamento"}
              </button>
            </div>
          </form>

          <aside className={styles.infoCard}>
            <h2>Antes de doar</h2>

            <ul>
              <li>Leve um documento oficial com foto.</li>
              <li>Esteja alimentado e evite alimentos gordurosos antes da doação.</li>
              <li>Durma bem na noite anterior.</li>
              <li>Informe qualquer sintoma recente durante a triagem.</li>
            </ul>
          </aside>
        </section>
      </main>
    </>
  );
}

export default NovoAgendamento;