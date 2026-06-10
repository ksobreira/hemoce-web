import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; 
import styles from './Perfil.module.css';

function Perfil() {
  const navigate = useNavigate();
  const auth = useAuth();
 
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const buscarDadosPerfil = async () => {
      try {
        setLoading(true);
        
        
        const API_URL = 'http://localhost:8080'; 
        
        const token = localStorage.getItem('token') || auth?.token;

        const response = await fetch(`${API_URL}/usuarios/perfil`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
        
            'Authorization': token ? `Bearer ${token}` : '' 
          }
        });

        if (!response.ok) {
          throw new Error('Não foi possível carregar os dados do perfil.');
        }

        const data = await response.json();
        setDadosUsuario(data);
      } catch (err) {
        console.error(err);
        setErro(err.message);
      } finally {
        setLoading(false);
      }
    };

    buscarDadosPerfil();
  }, [auth]);

  const handleLogout = () => {
    if (auth?.logout) {
      auth.logout();
    }
    navigate('/login');
  };

  // Função para formatar LocalDate (AAAA-MM-DD) para DD/MM/AAAA
  const formatarData = (dataString) => {
    if (!dataString) return 'Não informada';
    const partes = dataString.split('-'); // ['2026', '06', '09']
    if (partes.length !== 3) return dataString;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  // Lógica de Negócio: Calcula dias restantes e aptidão baseado no sexo do usuário
  const statusDoacao = useMemo(() => {
    // Como o endpoint atual não traz a lista de doações, simulamos com base na última cadastrada
    // Caso seu back envie as doações futuramente, altere para dadosUsuario?.doacoes
    const doacoesDoUsuario = dadosUsuario?.doacoes || []; 

    if (doacoesDoUsuario.length === 0) {
      return { diasRestantes: 0, apto: true, mensagem: 'APTO' };
    }

    const ultimaDoacaoData = new Date(doacoesDoUsuario[0].data);
    const hoje = new Date();
    
    const diferencaTempo = hoje.getTime() - ultimaDoacaoData.getTime();
    const diasPassados = Math.floor(diferencaTempo / (1000 * 60 * 60 * 24));

    // Regra padrão: Homem 90 dias, Mulher 120 dias
    const intervaloNecessario = dadosUsuario?.sexo?.toUpperCase() === 'F' ? 120 : 90;
    const restantes = intervaloNecessario - diasPassados;

    if (restantes > 0) {
      return { diasRestantes: restantes, apto: false, mensagem: 'INAPTO TEMPORARIAMENTE' };
    }

    return { diasRestantes: 0, apto: true, mensagem: 'APTO' };
  }, [dadosUsuario]);

  // 1. Tela de Carregamento Inicial
  if (loading) {
    return (
      <div className={styles.containerLoading}>
        <div className={styles.spinner}></div>
        <p>Carregando dados do perfil Hemoce...</p>
      </div>
    );
  }


  if (erro) {
    return (
      <div className={styles.containerLoading} style={{ color: '#c53030' }}>
        <h2>⚠️ Erro ao carregar perfil</h2>
        <p>{erro}</p>
        <button className={styles.btnEditar} style={{ maxWidth: '200px' }} onClick={() => window.location.reload()}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Topbar Superior */}
      <header className={styles.topbar}>
        <div className={styles.logoArea}>
          <div className={styles.logoSquare}></div>
          <span className={styles.logoTexto}>DOAÇÃO DE SANGUE</span>
        </div>
        <div className={styles.usuarioBadge}>
          {(dadosUsuario?.nome || 'USUÁRIO').toUpperCase()}
        </div>
      </header>

      {/* Menu de Navegação Global */}
      <nav className={styles.navbar}>
        <button className={styles.navItem} onClick={() => navigate('/home')}>INÍCIO</button>
        <button className={styles.navItem} onClick={() => navigate('/agendamentos')}>AGENDAMENTOS</button>
        <button className={styles.navItem} onClick={() => navigate('/campanhas')}>CAMPANHAS</button>
        <button className={styles.navItem} onClick={() => navigate('/orientacoes')}> ORIENTAÇÕES</button>
        <button className={styles.navItem} onClick={() => navigate('/assistente')}>ASSISTENTE IA</button>
      </nav>

      {/* Área de Conteúdo Central */}
      <main className={styles.conteudo}>
        <h2 className={styles.tituloPagina}>MEU PERFIL</h2>

        <div className={styles.gridSuperior}>
          {/* Coluna Esquerda: Dados Pessoais vindos do Endpoint */}
          <section className={styles.cardDadosPessoais}>
            <h3>DADOS PESSOAIS</h3>
            <div className={styles.formFake}>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>NOME COMPLETO:</label>
                  <div className={styles.dadoBox}>{dadosUsuario?.nome ?? 'Não informado'}</div>
                </div>
                <div className={styles.inputGroupSmall}>
                  <label>TIPO SANGUÍNEO:</label>
                  <div className={styles.dadoBoxDestaque}>{dadosUsuario?.tipoSanguineo ?? 'N/A'}</div>
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>CPF:</label>
                  <div className={styles.dadoBox}>{dadosUsuario?.cpf ?? 'Não informado'}</div>
                </div>
                <div className={styles.inputGroup}>
                  <label>DATA DE NASCIMENTO:</label>
                  <div className={styles.dadoBox}>
                    {formatarData(dadosUsuario?.dataNascimento)}
                  </div>
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>E-MAIL:</label>
                  <div className={styles.dadoBox}>{dadosUsuario?.email ?? 'Não informado'}</div>
                </div>
                <div className={styles.inputGroup}>
                  <label>TELEFONE:</label>
                  <div className={styles.dadoBox}>{dadosUsuario?.telefone ?? 'Não informado'}</div>
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>CIDADE:</label>
                  <div className={styles.dadoBox}>{dadosUsuario?.cidade ?? 'Não informada'}</div>
                </div>
                <div className={styles.inputGroupSmall}>
                  <label>SEXO:</label>
                  <div className={styles.dadoBox} style={{ textAlign: 'center' }}>
                    {dadosUsuario?.sexo ?? '-'}
                  </div>
                </div>
              </div>

              <button className={styles.btnEditar} onClick={() => navigate('/perfil/editar')}>
                EDITAR DADOS
              </button>
            </div>
          </section>

          {/* Coluna Direita: Estatísticas Rápidas */}
          <aside className={styles.colunaLateral}>
            <div className={styles.cardEstatistica}>
              <h3>ESTATÍSTICAS</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <span className={styles.statNumero}>{dadosUsuario?.doacoes?.length ?? 0}</span>
                  <span className={styles.statLabel}>DOAÇÕES REALIZADAS</span>
                </div>
                <div className={styles.statItem}>
                  <span 
                    className={styles.statStatus} 
                    style={{ color: statusDoacao.apto ? '#2f855a' : '#c53030' }}
                  >
                    {statusDoacao.apto ? '✓ APTO' : '✕ INAPTO'}
                  </span>
                  <span className={styles.statLabel}>{statusDoacao.mensagem}</span>
                </div>
              </div>
            </div>

            <div className={styles.cardProximaDoacao}>
              <h3>PRÓXIMA DOAÇÃO</h3>
              <div className={styles.countdownContainer}>
                <span className={styles.countdownNumero}>
                  {statusDoacao.diasRestantes}
                </span>
                <span className={styles.countdownLabel}>DIAS RESTANTES</span>
              </div>
            </div>

            <button className={styles.btnSair} onClick={handleLogout}>
              SAIR DA CONTA
            </button>
          </aside>
        </div>

        {/* Seção Inferior: Histórico de Doações */}
        <section className={styles.cardHistorico}>
          <h3>HISTÓRICO DE DOAÇÕES</h3>
          <div className={styles.listaHistorico}>
            {dadosUsuario?.doacoes && dadosUsuario.doacoes.length > 0 ? (
              dadosUsuario.doacoes.map((item, index) => (
                <div key={index} className={styles.historicoLinha}>
                  <div className={styles.historicoInfo}>
                    <strong>{formatarData(item.data)}</strong>
                    <span>{item.local ?? 'Hemocentro'}</span>
                  </div>
                  <span className={styles.tagRealizado}>{item.status ?? 'CONFIRMADO'}</span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '15px', fontSize: '0.85rem', color: '#666' }}>
                Nenhuma doação cadastrada no histórico.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Perfil;