import React from 'react';
import Header from '../../components/layout/Header';
import styles from './Orientacoes.module.css';

function Orientações() {
  const requisitos = [
    { id: 1, titulo: 'Idade', info: 'Ter entre 16 e 69 anos (menores de 18 com autorização).' },
    { id: 2, titulo: 'Peso', info: 'Pesar no mínimo 50kg.' },
    { id: 3, titulo: 'Saúde', info: 'Estar descansado e não ter ingerido álcool nas últimas 12h.' },
    { id: 4, titulo: 'Documentos', info: 'Apresentar documento original com foto.' }
  ];

  const impedimentos = [
    { id: 5, titulo: 'Temporários', info: 'Gripe, gravidez, tatuagem recente (12 meses).' },
    { id: 6, titulo: 'Definitivos', info: 'Hepatite após os 11 anos, doenças transmissíveis pelo sangue.' }
  ];

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.content}>
        <h1 className={styles.tituloPagina}>Quem pode doar?</h1>
        <p className={styles.subtitulo}>Confira os requisitos básicos e prepare-se para salvar vidas.</p>

        <section className={styles.section}>
          <h2>Requisitos Básicos</h2>
          <div className={styles.grid}>
            {requisitos.map(item => (
              <div key={item.id} className={styles.card}>
                <h3>{item.titulo}</h3>
                <p>{item.info}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>Principais Impedimentos</h2>
          <div className={styles.listaImpedimentos}>
            {impedimentos.map(item => (
              <div key={item.id} className={styles.itemImpedimento}>
                <span className={styles.bullet}>!</span>
                <div>
                  <h4>{item.titulo}</h4>
                  <p>{item.info}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.bannerDica}>
          <p><strong>Dica:</strong> No dia da doação, alimente-se bem, mas evite comidas gordurosas!</p>
        </div>
      </main>
    </div>
  );
}

export default Orientações;