import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import { useAuth } from "../../hooks/useAuth";
import { perfilService } from "../../services/api";
import styles from "./Perfil.module.css";

const tiposSanguineos = [
  ["A_POS", "A+"],
  ["A_NEG", "A-"],
  ["B_POS", "B+"],
  ["B_NEG", "B-"],
  ["AB_POS", "AB+"],
  ["AB_NEG", "AB-"],
  ["O_POS", "O+"],
  ["O_NEG", "O-"],
];

const sexos = [
  ["MASCULINO", "Masculino"],
  ["FEMININO", "Feminino"],
];

function somenteNumeros(value) {
  return value.replace(/\D/g, "").slice(0, 11);
}

function telefoneValido(value) {
  const telefoneLimpo = somenteNumeros(value);
  return telefoneLimpo.length === 10 || telefoneLimpo.length === 11;
}

function formatarTipoSanguineo(tipo) {
  const item = tiposSanguineos.find(([value]) => value === tipo);
  return item?.[1] || tipo || "Não informado";
}

function formatarSexo(sexo) {
  const item = sexos.find(([value]) => value === sexo);
  return item?.[1] || sexo || "Não informado";
}

function formatarData(data) {
  if (!data) return "Não informado";

  const [ano, mes, dia] = data.split("-");
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : data;
}

function getInitials(name, fallback = "US") {
  if (!name) return fallback;

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  return parts[0]?.slice(0, 2).toUpperCase() || fallback;
}

function criarFormularioUsuario(perfil) {
  return {
    nome: perfil?.nome || "",
    telefone: somenteNumeros(perfil?.telefone || ""),
    cidade: perfil?.cidade || "",
    dataNascimento: perfil?.dataNascimento || "",
    tipoSanguineo: perfil?.tipoSanguineo || "",
    sexo: perfil?.sexo || "",
  };
}

function criarFormularioAdmin(perfil) {
  return {
    nome: perfil?.nome || "Administrador",
    telefone: somenteNumeros(perfil?.telefone || ""),
    cargo: perfil?.cargo || "",
    hemocentroId: perfil?.hemocentroId ?? null,
  };
}

function Perfil() {
  const { isAdmin, userEmail, updateUserData } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [form, setForm] = useState(criarFormularioUsuario(null));
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [adminEditavel, setAdminEditavel] = useState(true);

  useEffect(() => {
    async function carregarPerfil() {
      try {
        setLoading(true);
        setErro("");
        setSucesso("");
        setAdminEditavel(true);

        const dados = isAdmin
          ? await perfilService.obterPerfilAdmin()
          : await perfilService.obterPerfil();

        setPerfil(dados);
        setForm(isAdmin ? criarFormularioAdmin(dados) : criarFormularioUsuario(dados));
        updateUserData({ name: dados?.nome, email: dados?.email });
      } catch {
        if (isAdmin) {
          setPerfil(null);
          setForm(criarFormularioAdmin(null));
          setAdminEditavel(false);
          setErro("Para alterar dados administrativos, entre em contato com o responsável pelo sistema.");
        } else {
          setErro("Não foi possível carregar os dados do perfil no momento.");
        }
      } finally {
        setLoading(false);
      }
    }

    carregarPerfil();
  }, [isAdmin, updateUserData]);

  const campos = useMemo(() => {
    if (isAdmin) {
      return [
        ["Nome", perfil?.nome || "Administrador"],
        ["E-mail", perfil?.email || userEmail || "admin@sangueamigo.local"],
        ["Telefone", perfil?.telefone],
        ["Cargo", perfil?.cargo],
        ["Hemocentro", perfil?.nomeHemocentro],
        ["Tipo de acesso", "Administrativo"],
      ];
    }

    if (!perfil) return [];

    return [
      ["Nome", perfil.nome],
      ["E-mail", perfil.email],
      ["CPF", perfil.cpf],
      ["Telefone", perfil.telefone],
      ["Cidade", perfil.cidade],
      ["Data de nascimento", formatarData(perfil.dataNascimento)],
      ["Tipo sanguíneo", formatarTipoSanguineo(perfil.tipoSanguineo)],
      ["Sexo", formatarSexo(perfil.sexo)],
    ];
  }, [isAdmin, perfil, userEmail]);

  const adminAtalhos = [
    {
      to: "/admin",
      title: "Painel administrativo",
      description: "Acesse a visão geral da administração.",
    },
    {
      to: "/admin/campanhas",
      title: "Campanhas",
      description: "Gerencie campanhas e alertas ativos.",
    },
    {
      to: "/admin/agendamentos",
      title: "Agendamentos",
      description: "Acompanhe e atualize solicitações de doação.",
    },
  ];

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: name === "telefone" ? somenteNumeros(value) : value,
    }));
  }

  function handleCancelar() {
    setForm(isAdmin ? criarFormularioAdmin(perfil) : criarFormularioUsuario(perfil));
    setEditando(false);
    setErro("");
    setSucesso("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSalvando(true);
      setErro("");
      setSucesso("");

      if (!telefoneValido(form.telefone)) {
        setErro("Informe um telefone válido com DDD.");
        return;
      }

      const telefoneLimpo = somenteNumeros(form.telefone);

      const dadosAtualizados = isAdmin
        ? await perfilService.atualizarPerfilAdmin({
            nome: form.nome.trim(),
            telefone: telefoneLimpo,
            cargo: form.cargo.trim(),
            hemocentroId: form.hemocentroId,
          })
        : await perfilService.atualizarPerfil({
            nome: form.nome.trim(),
            telefone: telefoneLimpo,
            cidade: form.cidade.trim(),
            dataNascimento: form.dataNascimento,
            tipoSanguineo: form.tipoSanguineo,
            sexo: form.sexo,
          });

      setPerfil(dadosAtualizados);
      setForm(
        isAdmin
          ? criarFormularioAdmin(dadosAtualizados)
          : criarFormularioUsuario(dadosAtualizados)
      );
      updateUserData({
        name: dadosAtualizados?.nome,
        email: dadosAtualizados?.email,
      });
      setEditando(false);
      setSucesso("Perfil atualizado com sucesso.");
    } catch {
      setErro("Não foi possível atualizar o perfil. Confira os dados e tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  const tituloPerfil = isAdmin ? "Perfil Administrativo" : "Meu perfil";
  const subtituloPerfil = isAdmin
    ? "Confira seus dados administrativos e acesse rapidamente as áreas de gestão."
    : "Confira seus dados cadastrados no sistema.";
  const nomeExibido = isAdmin
    ? perfil?.nome || "Administrador"
    : perfil?.nome || "Usuário Sangue Amigo";
  const avatar = isAdmin ? "AD" : getInitials(perfil?.nome || perfil?.email);

  return (
    <>
      <Header />

      <main className={styles.page}>
        <section className={styles.pageHeader}>
          <div>
            <span className={styles.eyebrow}>Conta</span>
            <h1>{tituloPerfil}</h1>
            <p>{subtituloPerfil}</p>
          </div>
        </section>

        {loading && (
          <section className={styles.feedbackBox}>
            <p>Carregando perfil...</p>
          </section>
        )}

        {!loading && !isAdmin && erro && !perfil && (
          <section className={styles.errorBox}>
            <h2>Perfil indisponível</h2>
            <p>{erro}</p>
          </section>
        )}

        {!loading && (isAdmin || perfil) && (
          <section className={styles.profilePanel}>
            <div className={styles.profileSummary}>
              <div className={styles.avatar}>{avatar}</div>

              <div>
                <h2>{nomeExibido}</h2>
                <p>{isAdmin ? "Perfil: Administrador" : "Doador"}</p>
              </div>
            </div>

            {sucesso && <p className={styles.successBox}>{sucesso}</p>}
            {erro && <p className={styles.inlineError}>{erro}</p>}

            {!editando ? (
              <>
                <div className={styles.detailsGrid}>
                  {campos.map(([label, value]) => (
                    <div key={label} className={styles.detailItem}>
                      <span>{label}</span>
                      <strong>{value || "Não informado"}</strong>
                    </div>
                  ))}
                </div>

                {isAdmin && (
                  <div className={styles.shortcutGrid}>
                    {adminAtalhos.map((atalho) => (
                      <Link key={atalho.to} to={atalho.to} className={styles.shortcutCard}>
                        <strong>{atalho.title}</strong>
                        <span>{atalho.description}</span>
                      </Link>
                    ))}
                  </div>
                )}

                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={() => {
                      setEditando(true);
                      setErro("");
                      setSucesso("");
                    }}
                    disabled={isAdmin && !adminEditavel}
                  >
                    Editar perfil
                  </button>
                </div>
              </>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                {isAdmin ? (
                  <div className={styles.formGrid}>
                    <label>
                      Nome
                      <input
                        name="nome"
                        value={form.nome}
                        onChange={handleChange}
                        required
                      />
                    </label>

                    <label>
                      Telefone
                      <input
                        name="telefone"
                        inputMode="numeric"
                        maxLength={11}
                        pattern="[0-9]*"
                        value={form.telefone}
                        onChange={handleChange}
                      />
                    </label>

                    <label>
                      Cargo
                      <input
                        name="cargo"
                        value={form.cargo}
                        onChange={handleChange}
                        required
                      />
                    </label>

                    <label>
                      E-mail
                      <input
                        value={perfil?.email || userEmail || "admin@sangueamigo.local"}
                        disabled
                      />
                    </label>
                  </div>
                ) : (
                  <>
                    <div className={styles.formGrid}>
                      <label>
                        Nome
                        <input
                          name="nome"
                          value={form.nome}
                          onChange={handleChange}
                          required
                        />
                      </label>

                      <label>
                        Telefone
                        <input
                          name="telefone"
                          inputMode="numeric"
                          maxLength={11}
                          pattern="[0-9]*"
                          value={form.telefone}
                          onChange={handleChange}
                        />
                      </label>

                      <label>
                        Cidade
                        <input
                          name="cidade"
                          value={form.cidade}
                          onChange={handleChange}
                        />
                      </label>

                      <label>
                        Data de nascimento
                        <input
                          type="date"
                          name="dataNascimento"
                          value={form.dataNascimento}
                          onChange={handleChange}
                          required
                        />
                      </label>

                      <label>
                        Tipo sanguíneo
                        <select
                          name="tipoSanguineo"
                          value={form.tipoSanguineo}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Selecione</option>
                          {tiposSanguineos.map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        Sexo
                        <select
                          name="sexo"
                          value={form.sexo}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Selecione</option>
                          {sexos.map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        E-mail
                        <input value={perfil.email || ""} disabled />
                      </label>

                      <label>
                        CPF
                        <input value={perfil.cpf || ""} disabled />
                      </label>
                    </div>

                    <p className={styles.formHint}>
                      Para alterar e-mail ou CPF, entre em contato com a unidade responsável.
                    </p>
                  </>
                )}

                {isAdmin && (
                  <p className={styles.formHint}>
                    Para alterar e-mail ou vínculo de unidade, entre em contato com o responsável pelo sistema.
                  </p>
                )}

                <div className={styles.actions}>
                  <button
                    type="submit"
                    className={styles.primaryButton}
                    disabled={salvando}
                  >
                    {salvando ? "Salvando..." : "Salvar alterações"}
                  </button>

                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={handleCancelar}
                    disabled={salvando}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </section>
        )}
      </main>
    </>
  );
}

export default Perfil;
