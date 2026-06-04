import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import styles from "./NovoAgendamento.module.css";

function NovoAgendamento() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    unidade: "",
    data: "",
    horario: "",
    tipoSanguineo: "",
    observacoes: "",
  });

  const unidades = [
    "Hemoce Fortaleza",
    "Unidade Sobral",
    "Unidade Crato",
    "Unidade Iguatu",
  ];

  const horarios = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  const tiposSanguineos = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
    "Não sei informar",
  ];

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    console.log("Dados do agendamento:", formData);

    alert(
      "Agendamento simulado com sucesso! Nesta etapa, os dados ainda não são salvos no banco."
    );

    navigate("/agendamentos");
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
              Preencha os dados abaixo para simular o agendamento da sua doação
              de sangue.
            </p>
          </div>
        </section>

        <section className={styles.contentGrid}>
          <form className={styles.formCard} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="unidade">Unidade de doação</label>
              <select
                id="unidade"
                name="unidade"
                value={formData.unidade}
                onChange={handleChange}
                required
              >
                <option value="">Selecione uma unidade</option>
                {unidades.map((unidade) => (
                  <option key={unidade} value={unidade}>
                    {unidade}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="data">Data</label>
                <input
                  id="data"
                  name="data"
                  type="date"
                  value={formData.data}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="horario">Horário</label>
                <select
                  id="horario"
                  name="horario"
                  value={formData.horario}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>
                  {horarios.map((horario) => (
                    <option key={horario} value={horario}>
                      {horario}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="tipoSanguineo">Tipo sanguíneo</label>
              <select
                id="tipoSanguineo"
                name="tipoSanguineo"
                value={formData.tipoSanguineo}
                onChange={handleChange}
                required
              >
                <option value="">Selecione seu tipo sanguíneo</option>
                {tiposSanguineos.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="observacoes">Observações</label>
              <textarea
                id="observacoes"
                name="observacoes"
                rows="5"
                placeholder="Exemplo: prefiro atendimento pela manhã, tenho dúvidas sobre documentação, etc."
                value={formData.observacoes}
                onChange={handleChange}
              />
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={handleCancel}
              >
                Cancelar
              </button>

              <button type="submit" className={styles.primaryButton}>
                Confirmar agendamento
              </button>
            </div>
          </form>

          <aside className={styles.infoCard}>
            <h2>Antes de doar</h2>

            <ul>
              <li>Leve um documento oficial com foto.</li>
              <li>Esteja alimentado e evite alimentos gordurosos antes da doação.</li>
              <li>Durma bem na noite anterior.</li>
              <li>Evite bebidas alcoólicas nas horas anteriores à doação.</li>
            </ul>

            <div className={styles.warningBox}>
              <strong>Importante</strong>
              <p>
                Esta tela ainda usa dados mockados. O envio real para banco de
                dados ou API será implementado futuramente.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}

export default NovoAgendamento;