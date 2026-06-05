import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Cadastro.module.css';
import { FaGithub } from 'react-icons/fa';
import logoSangueAmigo from '../../assets/LogoSangueAmigo.png';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [cidade, setCidade] = useState('');
  const [tipoSanguineo, setTipoSanguineo] = useState('');
  const [fatorRhPositivo, setFatorRhPositivo] = useState(true); 
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleCadastro = (e) => {
    e.preventDefault();
    const sinalRh = fatorRhPositivo ? '+' : '-';
    const tipoCompleto = tipoSanguineo === 'Não Sei' ? 'Não Sei' : `${tipoSanguineo}${sinalRh}`;
    
    console.log("Dados salvos:", { nome, email, cpf, cidade, tipoCompleto, senha });
    //Integraçõ futura backend
  };

  return (
    <div className={styles.container}>
      
      {/*Imagem do Hemoce com overlay e animação */}
      <div className={styles.metadeEsquerda}>
        <div className={styles.backgroundOverlay}></div>
      </div>

      {/*Card do formulário flutuante */}
      <div className={styles.metadeDireita}>
        <div className={styles.cadastroCard}>
          
          <div className={styles.brandHeader}>
            <div className={styles.logoWrapper}>
              <img src={logoSangueAmigo} alt="Logo Sangue Amigo" className={styles.logoImg} />
            </div>
            <p className={styles.slogan}>Crie sua conta e comece a salvar vidas</p>
          </div>

          <div className={styles.formSection}>
            <form onSubmit={handleCadastro} className={styles.form}>
              <div className={styles.formGrid}>
                
                {/* Nome Completo */}
                <div className={styles.inputGroupFull}>
                  <label htmlFor="nome">NOME COMPLETO</label>
                  <input id="nome" type="text" placeholder="Seu nome completo" value={nome} onChange={(e) => setNome(e.target.value)} required />
                </div>

                {/* E-mail */}
                <div className={styles.inputGroupFull}>
                  <label htmlFor="email">E-MAIL</label>
                  <input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                {/* CPF */}
                <div className={styles.inputGroup}>
                   <label htmlFor="cpf">CPF</label>
                        <input
                          id="cpf" type="text" placeholder="000.000.000-00" value={cpf}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");

                            if (value.length <= 11) {
                              setCpf(value);
                            }
                          }}
                          required
                        />
                </div>

                {/* Cidade */}
                <div className={styles.inputGroup}>
                  <label htmlFor="cidade">CIDADE</label>
                  <input id="cidade" type="text" placeholder="Sua cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} required />
                </div>

                {/* Tipo Sanguíneo */}
                <div className={styles.inputGroup}>
                  <label htmlFor="tipoSanguineo">TIPO SANGUÍNEO</label>
                  <select id="tipoSanguineo" value={tipoSanguineo} onChange={(e) => setTipoSanguineo(e.target.value)} required>
                    <option value="" disabled hidden>Selecione</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                    <option value="Não Sei">Não sei</option>
                  </select>
                </div>

                {/* Toggle Switch Fator RH */}
                <div className={styles.inputGroupRh}>
                  <label>FATOR RH</label>
                  <div className={styles.switchContainer}>
                    <span className={`${styles.labelRh} ${!fatorRhPositivo ? styles.rhAtivo : ''}`}>NEGATIVO (-)</span>
                    <label className={styles.switch}>
                      <input 
                        type="checkbox" 
                        checked={fatorRhPositivo} 
                        onChange={(e) => setFatorRhPositivo(e.target.checked)}
                        disabled={tipoSanguineo === 'Não Sei'} // Desativa se o usuário não souber o tipo
                      />
                      <span className={styles.slider}></span>
                    </label>
                    <span className={`${styles.labelRh} ${fatorRhPositivo && tipoSanguineo !== 'Não Sei' ? styles.rhAtivo : ''}`}>POSITIVO (+)</span>
                  </div>
                </div>

                {/* Senha */}
                <div className={styles.inputGroupFull}>
                  <label htmlFor="senha">SENHA</label>
                  <input id="senha" type="password" placeholder="Crie uma senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                </div>

                {/* Confirmar Senha */}
                <div className={styles.inputGroupFull}>
                  <label htmlFor="confirmarSenha">CONFIRMAR SENHA</label>
                  <input id="confirmarSenha" type="password" placeholder="Repita a senha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required />
                </div>

              </div>

              <button type="submit" className={styles.btnCadastrar}>CADASTRAR</button>
            </form>

            <div className={styles.formFooter}>
              <p>Já possui uma conta? <Link to="/login" className={styles.linkDestaque}>Faça Login</Link></p>
            </div>
          </div>

        </div>
      </div>

      <div className={styles.rodapeFlutuante}>
        <div className={styles.secaoEsquerda}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Sangue Amigo. Todos os direitos reservados.
          </p>
        </div>
        <div className={styles.secaoDireita}>
          <span className={styles.sigaNos}>Link do nosso repositório:</span>
          <div className={styles.socialIcons}>
            <a href="https://github.com/ksobreira/hemoce-web" target="_blank"><FaGithub /></a>

          </div>
        </div>
      </div>

    </div>
  );
}

export default Cadastro;