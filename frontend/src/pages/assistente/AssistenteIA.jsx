import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/layout/Header";
import { assistenteIaService } from "../../services/api";
import styles from "./AssistenteIA.module.css";

const sugestoes = [
  "Quem pode doar sangue?",
  "Posso doar sangue gripado?",
  "Quanto tempo dura uma doação?",
  "Quais documentos preciso levar?",
  "Posso doar tomando medicamento?",
  "Qual o intervalo entre doações?",
];

const mensagemInicial = {
  id: "inicio",
  autor: "assistente",
  texto:
    "Olá! Posso ajudar com dúvidas gerais sobre doação de sangue. Para casos específicos, confirme sempre com a equipe do hemocentro.",
};

function criarMensagem(autor, texto, aviso = "") {
  return {
    id: `${autor}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    autor,
    texto,
    aviso,
  };
}

function AssistenteIA() {
  const [mensagens, setMensagens] = useState([mensagemInicial]);
  const [pergunta, setPergunta] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, loading]);

  async function enviarPergunta(textoPergunta = pergunta) {
    const texto = textoPergunta.trim();

    if (!texto || loading) {
      return;
    }

    setErro("");
    setLoading(true);
    setPergunta("");

    const mensagemUsuario = criarMensagem("usuario", texto);
    setMensagens((atuais) => [...atuais, mensagemUsuario]);

    try {
      const resposta = await assistenteIaService.enviarMensagem(texto);
      const textoResposta = resposta?.resposta?.trim();

      if (!textoResposta) {
        throw new Error("Resposta vazia");
      }

      setMensagens((atuais) => [
        ...atuais,
        criarMensagem(
          "assistente",
          textoResposta,
          resposta?.aviso || ""
        ),
      ]);
    } catch {
      setErro("Não foi possível enviar sua pergunta. Tente novamente.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    enviarPergunta();
  }

  function handleSugestao(texto) {
    enviarPergunta(texto);
  }

  return (
    <>
      <Header />

      <main className={styles.page}>
        <section className={styles.pageHeader}>
          <span className={styles.eyebrow}>Sangue Amigo</span>
          <h1>Assistente de Doação</h1>
          <p>
            Tire dúvidas gerais sobre doação de sangue de forma rápida e simples.
          </p>
        </section>

        <section className={styles.contentGrid}>
          <div className={styles.chatPanel}>
            <div className={styles.chatHeader}>
              <div>
                <strong>Conversa</strong>
                <span>Orientações gerais sobre doação de sangue</span>
              </div>
            </div>

            <div className={styles.chatList} aria-live="polite">
              {mensagens.map((mensagem) => (
                <article
                  key={mensagem.id}
                  className={`${styles.message} ${
                    mensagem.autor === "usuario"
                      ? styles.userMessage
                      : styles.assistantMessage
                  }`}
                >
                  <span className={styles.messageAuthor}>
                    {mensagem.autor === "usuario" ? "Você" : "Assistente"}
                  </span>
                  <p>{mensagem.texto}</p>
                  {mensagem.aviso && (
                    <small className={styles.notice}>{mensagem.aviso}</small>
                  )}
                </article>
              ))}

              {loading && (
                <article className={`${styles.message} ${styles.assistantMessage}`}>
                  <span className={styles.messageAuthor}>Assistente</span>
                  <p>Preparando resposta...</p>
                </article>
              )}

              <div ref={bottomRef} />
            </div>

            {erro && <p className={styles.errorMessage}>{erro}</p>}

            <form className={styles.inputArea} onSubmit={handleSubmit}>
              <textarea
                ref={inputRef}
                value={pergunta}
                onChange={(event) => setPergunta(event.target.value)}
                placeholder="Digite sua dúvida sobre doação de sangue"
                rows={2}
                disabled={loading}
              />

              <button type="submit" disabled={loading || !pergunta.trim()}>
                {loading ? "Enviando..." : "Enviar"}
              </button>
            </form>
          </div>

          <aside className={styles.suggestionsPanel}>
            <h2>Sugestões rápidas</h2>
            <div className={styles.suggestionList}>
              {sugestoes.map((sugestao) => (
                <button
                  key={sugestao}
                  type="button"
                  onClick={() => handleSugestao(sugestao)}
                  disabled={loading}
                >
                  {sugestao}
                </button>
              ))}
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}

export default AssistenteIA;
