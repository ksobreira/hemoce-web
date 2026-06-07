import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import { campanhasService, hemocentrosService } from "../../services/api";
import styles from "./AdminNovaCampanha.module.css";

function AdminNovaCampanha() {
  const navigate = useNavigate();

  const [hemocentros, setHemocentros] = useState([]);
  const [loadingHemocentros, setLoadingHemocentros] = useState(true);
  const [erroHemocentros, setErroHemocentros] = useState("");

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [formData, setFormData] = useState({
    hemocentroId: "",
    titulo: "",
    descricao: "",
    urlImagem: "",
    tiposSanguineosNecessarios: [],
    dataInicio: "",
    dataFim: "",
    endereco: "",
    cidade: "",
    estado: "CE",
    urgencia: "NORMAL",
  });

  const tiposSanguineos = [
    { label: "A+", value: "A_POS" },
    { label: "A-", value: "A_NEG" },
    { label: "B+", value: "B_POS" },
    { label: "B-", value: "B_NEG" },
    { label: "AB+", value: "AB_POS" },
    { label: "AB-", value: "AB_NEG" },
    { label: "O+", value: "O_POS" },
    { label: "O-", value: "O_NEG" },
  ];

  useEffect(() => {
    async function carregarHemocentros() {
      try {
        setLoadingHemocentros(true);
        setErroHemocentros("");

        const dados = await hemocentrosService.listarHemocentros();
        setHemocentros(Array.isArray(dados) ? dados : []);
      } catch (error) {
        setErroHemocentros(
          error.message || "Não foi possível carregar as unidades."
        );
      } finally {
        setLoadingHemocentros(false);
      }
    }

    carregarHemocentros();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleTipoSanguineoChange(event) {
    const { value, checked } = event.target;

    setFormData((prevData) => {
      if (checked) {
        return {
          ...prevData,
          tiposSanguineosNecessarios: [
            ...prevData.tiposSanguineosNecessarios,
            value,
          ],
        };
      }

      return {
        ...prevData,
        tiposSanguineosNecessarios:
          prevData.tiposSanguineosNecessarios.filter((tipo) => tipo !== value),
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (formData.tiposSanguineosNecessarios.length === 0) {
      setErro("Selecione pelo menos um tipo sanguíneo.");
      return;
    }

    const payload = {
      hemocentroId: Number(formData.hemocentroId),
      titulo: formData.titulo,
      descricao: formData.descricao,
      urlImagem: formData.urlImagem,
      tiposSanguineosNecessarios: formData.tiposSanguineosNecessarios,
      dataInicio: formData.dataInicio,
      dataFim: formData.dataFim,
      endereco: formData.endereco,
      cidade: formData.cidade,
      estado: formData.estado,
      urgencia: formData.urgencia,
    };

    try {
      setSalvando(true);
      setErro("");

      await campanhasService.criarCampanha(payload);

      alert("Campanha cadastrada com sucesso!");
      navigate("/admin/campanhas");
    } catch (error) {
      setErro(error.message || "Não foi possível cadastrar a campanha.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <Header />

      <main className={styles.page}>
        <section className={styles.pageHeader}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate("/admin/campanhas")}
          >
            ← Voltar
          </button>

          <div>
            <span className={styles.eyebrow}>Área administrativa</span>
            <h1>Nova Campanha ou Alerta</h1>
            <p>
              Preencha os dados da campanha e selecione a unidade responsável.
            </p>
          </div>
        </section>

        <section className={styles.contentWrapper}>
          <form className={styles.formCard} onSubmit={handleSubmit}>
            {erro && <div className={styles.errorBox}>{erro}</div>}

            <div className={styles.formGroup}>
              <label htmlFor="hemocentroId">Unidade responsável</label>

              {loadingHemocentros ? (
                <p className={styles.helpText}>Carregando unidades...</p>
              ) : erroHemocentros ? (
                <p className={styles.errorText}>{erroHemocentros}</p>
              ) : (
                <select
                  id="hemocentroId"
                  name="hemocentroId"
                  value={formData.hemocentroId}
                  onChange={handleChange}
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

              {!loadingHemocentros && !erroHemocentros && hemocentros.length === 0 && (
                <p className={styles.errorText}>
                  Nenhuma unidade encontrada para vincular à campanha.
                </p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="titulo">Título da campanha</label>
              <input
                id="titulo"
                name="titulo"
                type="text"
                placeholder="Ex: Estoque baixo para O-"
                value={formData.titulo}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                rows="5"
                placeholder="Descreva o objetivo da campanha ou alerta..."
                value={formData.descricao}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Tipos sanguíneos necessários</label>

              <div className={styles.checkboxGrid}>
                {tiposSanguineos.map((tipo) => (
                  <label key={tipo.value} className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      value={tipo.value}
                      checked={formData.tiposSanguineosNecessarios.includes(
                        tipo.value
                      )}
                      onChange={handleTipoSanguineoChange}
                    />
                    <span>{tipo.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="dataInicio">Data de início</label>
                <input
                  id="dataInicio"
                  name="dataInicio"
                  type="date"
                  value={formData.dataInicio}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="dataFim">Data de encerramento</label>
                <input
                  id="dataFim"
                  name="dataFim"
                  type="date"
                  value={formData.dataFim}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="urgencia">Nível de urgência</label>
                <select
                  id="urgencia"
                  name="urgencia"
                  value={formData.urgencia}
                  onChange={handleChange}
                  required
                >
                  <option value="NORMAL">Normal</option>
                  <option value="ALTA">Alta</option>
                  <option value="CRITICA">Crítica</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="estado">Estado</label>
                <input
                  id="estado"
                  name="estado"
                  type="text"
                  value={formData.estado}
                  onChange={handleChange}
                  maxLength="2"
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="cidade">Cidade</label>
                <input
                  id="cidade"
                  name="cidade"
                  type="text"
                  placeholder="Ex: Fortaleza"
                  value={formData.cidade}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="endereco">Endereço</label>
                <input
                  id="endereco"
                  name="endereco"
                  type="text"
                  placeholder="Opcional"
                  value={formData.endereco}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="urlImagem">URL da imagem</label>
              <input
                id="urlImagem"
                name="urlImagem"
                type="text"
                placeholder="Opcional"
                value={formData.urlImagem}
                onChange={handleChange}
              />
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => navigate("/admin/campanhas")}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className={styles.primaryButton}
                disabled={salvando || hemocentros.length === 0}
              >
                {salvando ? "Salvando..." : "Cadastrar campanha"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}

export default AdminNovaCampanha;