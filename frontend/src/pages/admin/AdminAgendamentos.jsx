import React, { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import { agendamentosService, hemocentrosService } from "../../services/api";
import styles from "./AdminAgendamentos.module.css";

function formatarData(data) {
  if (!data) return "Data não informada";

  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function formatarHorario(horario) {
  if (!horario) return "--:--";
  return horario.slice(0, 5);
}

function ordenarPorDataHorario(lista) {
  return [...lista].sort((a, b) => {
    const dataA = `${a.data || ""}T${a.horario || "00:00"}`;
    const dataB = `${b.data || ""}T${b.horario || "00:00"}`;

    return dataA.localeCompare(dataB);
  });
}

function formatarStatus(status) {
  const mapa = {
    PENDENTE: "Pendente",
    CONFIRMADO: "Confirmado",
    CANCELADO: "Cancelado",
    CONCLUIDO: "Concluído",
  };

  return mapa[status] || status || "Não informado";
}

function AdminAgendamentos() {
  const [hemocentros, setHemocentros] = useState([]);
  const [hemocentroId, setHemocentroId] = useState("");
  const [data, setData] = useState("");

  const [agendamentos, setAgendamentos] = useState([]);
  const [loadingHemocentros, setLoadingHemocentros] = useState(true);
  const [loadingAgendamentos, setLoadingAgendamentos] = useState(false);

  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    async function carregarHemocentros() {
      try {
        setLoadingHemocentros(true);
        setErro("");

        const dados = await hemocentrosService.listarHemocentros();
        const lista = Array.isArray(dados) ? dados : [];

        setHemocentros(lista);

        if (lista.length > 0) {
          setHemocentroId(String(lista[0].id));
        }
      } catch (error) {
        setErro(error.message || "Não foi possível carregar as unidades.");
      } finally {
        setLoadingHemocentros(false);
      }
    }

    carregarHemocentros();
  }, []);

  async function carregarAgendamentos(event) {
    if (event) {
      event.preventDefault();
    }

    if (!hemocentroId || !data) {
      setErro("Selecione uma unidade e uma data para buscar os agendamentos.");
      return;
    }

    try {
      setLoadingAgendamentos(true);
      setErro("");
      setMensagem("");

      const dados = await agendamentosService.listarAgendamentosAdmin(
        hemocentroId,
        data
      );

      const lista = Array.isArray(dados) ? dados : [];
      setAgendamentos(ordenarPorDataHorario(lista));
    } catch (error) {
      setErro(error.message || "Não foi possível carregar os agendamentos.");
    } finally {
      setLoadingAgendamentos(false);
    }
  }

  async function handleAtualizarStatus(id, novoStatus) {
    try {
      setErro("");
      setMensagem("");

      await agendamentosService.atualizarStatusAdmin(id, novoStatus);

      setMensagem(`Status atualizado para ${formatarStatus(novoStatus)}.`);
      await carregarAgendamentos();
    } catch (error) {
      setErro(error.message || "Não foi possível atualizar o status.");
    }
  }

  return (
    <>
      <Header />

      <main className={styles.page}>
        <section className={styles.pageHeader}>
          <div>
            <span className={styles.eyebrow}>Área administrativa</span>
            <h1>Gerenciamento de Agendamentos</h1>
            <p>
              Consulte os agendamentos de uma unidade e atualize o status de cada
              solicitação.
            </p>
          </div>
        </section>

        <section className={styles.filterCard}>
          <form className={styles.filterForm} onSubmit={carregarAgendamentos}>
            <div className={styles.formGroup}>
              <label htmlFor="hemocentroId">Unidade</label>

              {loadingHemocentros ? (
                <p className={styles.helpText}>Carregando unidades...</p>
              ) : (
                <select
                  id="hemocentroId"
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
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="data">Data</label>
              <input
                id="data"
                type="date"
                value={data}
                onChange={(event) => setData(event.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.primaryButton}>
              Buscar agendamentos
            </button>
          </form>
        </section>

        {erro && (
          <section className={styles.errorBox}>
            <p>{erro}</p>
          </section>
        )}

        {mensagem && (
          <section className={styles.successBox}>
            <p>{mensagem}</p>
          </section>
        )}

        <section className={styles.contentCard}>
          {loadingAgendamentos && (
            <div className={styles.feedbackBox}>
              <p>Carregando agendamentos...</p>
            </div>
          )}

          {!loadingAgendamentos && agendamentos.length === 0 && (
            <div className={styles.feedbackBox}>
              <h2>Nenhum agendamento encontrado</h2>
              <p>
                Selecione a unidade e a data desejada para consultar os
                agendamentos.
              </p>
            </div>
          )}

          {!loadingAgendamentos && agendamentos.length > 0 && (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Unidade</th>
                    <th>Data</th>
                    <th>Horário</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {agendamentos.map((agendamento) => (
                    <tr key={agendamento.id}>
                      <td>
                        <strong>{agendamento.nomeHemocentro}</strong>
                        <span>{agendamento.enderecoHemocentro}</span>
                      </td>

                      <td>{formatarData(agendamento.data)}</td>

                      <td>{formatarHorario(agendamento.horario)}</td>

                      <td>
                        <span className={styles.statusBadge}>
                          {formatarStatus(agendamento.status)}
                        </span>
                      </td>

                      <td>
                        <div className={styles.actions}>
                          <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={() =>
                              handleAtualizarStatus(
                                agendamento.id,
                                "CONFIRMADO"
                              )
                            }
                            disabled={
                              agendamento.status === "CONFIRMADO" ||
                              agendamento.status === "CONCLUIDO" ||
                              agendamento.status === "CANCELADO"
                            }
                          >
                            Confirmar
                          </button>

                          <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={() =>
                              handleAtualizarStatus(
                                agendamento.id,
                                "CONCLUIDO"
                              )
                            }
                            disabled={
                              agendamento.status === "CONCLUIDO" ||
                              agendamento.status === "CANCELADO"
                            }
                          >
                            Concluir
                          </button>

                          <button
                            type="button"
                            className={styles.dangerButton}
                            onClick={() =>
                              handleAtualizarStatus(
                                agendamento.id,
                                "CANCELADO"
                              )
                            }
                            disabled={
                              agendamento.status === "CANCELADO" ||
                              agendamento.status === "CONCLUIDO"
                            }
                          >
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default AdminAgendamentos;
