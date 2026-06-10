import React, { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import { orientacoesService } from "../../services/api";
import styles from "./Orientacoes.module.css";

const orientacoesFallback = [
  {
    titulo: "Requisitos básicos",
    descricao: "Conferências iniciais antes de buscar um hemocentro.",
    itens: [
      "Estar em boas condições gerais de saúde.",
      "Apresentar documento oficial com foto.",
      "Estar alimentado e descansado.",
      "Confirmar idade, peso e demais critérios diretamente com a unidade de doação.",
    ],
  },
  {
    titulo: "Antes da doação",
    descricao: "Cuidados recomendados para o dia da doação.",
    itens: [
      "Evite jejum prolongado.",
      "Beba água ao longo do dia.",
      "Evite bebidas alcoólicas nas horas anteriores.",
      "Informe medicamentos em uso e histórico recente de saúde ao atendimento.",
    ],
  },
];

function Orientacoes() {
  const [orientacoes, setOrientacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarOrientacoes() {
      try {
        setLoading(true);
        setErro("");

        const dados = await orientacoesService.listarOrientacoes();
        setOrientacoes(Array.isArray(dados) ? dados : []);
      } catch (error) {
        setErro(
          error.message ||
            "Não foi possível carregar as orientações atualizadas."
        );
        setOrientacoes(orientacoesFallback);
      } finally {
        setLoading(false);
      }
    }

    carregarOrientacoes();
  }, []);

  return (
    <>
      <Header />

      <main className={styles.page}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Doação de sangue</span>
          <h1>Orientações para doar com segurança</h1>
          <p>
            Consulte cuidados importantes antes, durante e depois da doação.
            Casos específicos devem sempre ser confirmados com a equipe do
            hemocentro.
          </p>
        </section>

        {loading && (
          <section className={styles.feedbackBox}>
            <p>Carregando orientações...</p>
          </section>
        )}

        {erro && (
          <section className={styles.noticeBox}>
            <p>{erro}</p>
          </section>
        )}

        {!loading && orientacoes.length === 0 && (
          <section className={styles.feedbackBox}>
            <h2>Nenhuma orientação cadastrada</h2>
            <p>Assim que houver orientações disponíveis, elas aparecerão aqui.</p>
          </section>
        )}

        {!loading && orientacoes.length > 0 && (
          <section className={styles.grid}>
            {orientacoes.map((orientacao) => (
              <article key={orientacao.titulo} className={styles.card}>
                <div>
                  <h2>{orientacao.titulo}</h2>
                  <p>{orientacao.descricao}</p>
                </div>

                <ul>
                  {(orientacao.itens || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </section>
        )}
      </main>
    </>
  );
}

export default Orientacoes;
