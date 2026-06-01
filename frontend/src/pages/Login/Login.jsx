import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';
import { FaGithub } from 'react-icons/fa';
import logoSangueAmigo from '../../assets/LogoSangueAmigo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modalAberto, setModalAberto] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
  };

  return (
    <div className={styles.container}>
      
      {/* METADE ESQUERDA: Foto com overlay */}
      <div className={styles.metadeEsquerda}>
        <div className={styles.backgroundOverlay}></div>
      </div>

      {/* METADE DIREITA: Card centralizado */}
      <div className={styles.metadeDireita}>
        <div className={styles.loginCard}>
          
          <div className={styles.brandHeader}>
            <div className={styles.logoWrapper}>
              <img src={logoSangueAmigo} alt="Logo Sangue Amigo" className={styles.logoImg} />
            </div>
            <p className={styles.slogan}>Acesse sua conta Sangue Amigo</p>
          </div>

          <div className={styles.formSection}>
            <form onSubmit={handleLogin} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="email">E-MAIL</label>
                <input id="email" type="email" placeholder="Insira seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor="senha">SENHA</label>
                  <Link to="/recuperar-senha" className={styles.forgotPassword}>Esqueceu a senha?</Link>
                </div>
                <input id="senha" type="password" placeholder="Insira sua senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
              </div>

              <button type="submit" className={styles.btnEntrar}>ENTRAR</button>
            </form>

            <div className={styles.formFooter}>
              <p>Não possui conta? <Link to="/cadastro" className={styles.linkDestaque}>Cadastre-se</Link></p>
              <div className={styles.divider}><span>ou</span></div>
              <Link to="/admin/login" className={styles.adminLink}>Acesso Administrativo</Link>
            </div>
          </div>

        </div>
      </div>

      {/* Elementos do rodape flutuente */}
      <div className={styles.rodapeFlutuante}>
        
        {/* Lado Esquerdo: Botão Vermelho e Direitos Reservados */}
        <div className={styles.secaoEsquerda}>
          <button className={styles.btnSobreNosIsolado} onClick={() => setModalAberto(true)}>
            Sobre nós
          </button>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Sangue Amigo. Todos os direitos reservados.
          </p>
        </div>

        {/* Lado Direito: Ícones das Redes Sociais */}
        <div className={styles.secaoDireita}>
          <span className={styles.sigaNos}>Link do nosso repositório:</span>
          <div className={styles.socialIcons}>
            <a href="https://github.com/ksobreira/hemoce-web" target="_blank" title="GitHub">
              <FaGithub />
            </a>
          </div>
        </div>

      </div>

      {/* "MODAL" DO SOBRE NÓS */}
      {modalAberto && (
        <div className={styles.modalOverlay} onClick={() => setModalAberto(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalFechar} onClick={() => setModalAberto(false)}>&times;</button>
            
            <div className={styles.modalBody}>
              <div className={styles.modalTexto}>
                <h3>Sangue Amigo</h3>
                <p>
                  O Sangue Amigo é uma iniciativa dedicada a conectar doadores de sangue voluntários a 
                  hemocentros e hospitais. Nosso propósito é facilitar o processo de doação de sangue, 
                  promover a conscientização social e salvar vidas por meio do engajamento tecnológico.
                </p>

                <br/>

                <h3>
                  Nossa Equipe
                </h3>
                <p>
                  Este projeto foi desenvolvido por uma equipe dedicada a transformar a tecnologia em impacto social:
                  <br />
                  <strong>Renato Romano</strong> - 2426043
                  <br />
                  <strong>Júlia Alvino</strong> – 2422977
                  <br />
                  <strong>Kauam Sobreira</strong> – 2422967
                  <br />
                  <strong>Manoel Sergio</strong> – 2422973
                  <br />
                  <strong>Ricardo Augusto</strong> – 2116898
                </p>
              </div>
            </div>

          </div>
        </div>
     )}
    </div>
  );
}

export default Login;