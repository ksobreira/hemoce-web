import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

import { FaGithub } from 'react-icons/fa';
import logoSangueAmigo from '../../assets/LogoSangueAmigo.png';
import { useAuth } from '../../hooks/useAuth';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modalSobreNosAberto, setModalSobreNosAberto] = useState(false);
  const [modalEsqueciAberto, setModalEsqueciAberto] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState('');

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const response = await login(email, senha);

      if (response.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (error) {
      setErro(error.message || 'Não foi possível realizar o login.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecuperarSenha = (e) => {
    e.preventDefault();

    alert(
      `Se o e-mail ${emailRecuperacao} estiver cadastrado, você receberá as instruções de recuperação.`
    );

    setModalEsqueciAberto(false);
    setEmailRecuperacao('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.metadeEsquerda}>
        <div className={styles.backgroundOverlay}></div>
      </div>

      <div className={styles.metadeDireita}>
        <div className={styles.loginCard}>
          <div className={styles.brandHeader}>
            <div className={styles.logoWrapper}>
              <img
                src={logoSangueAmigo}
                alt="Logo Sangue Amigo"
                className={styles.logoImg}
              />
            </div>
            <p className={styles.slogan}>
              Acesse sua conta para continuar salvando vidas
            </p>
          </div>

          <div className={styles.formSection}>
            <form onSubmit={handleLogin} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="email">E-MAIL</label>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor="senha">SENHA</label>
                  <button
                    type="button"
                    className={styles.esqueceuSenhaBtn}
                    onClick={() => setModalEsqueciAberto(true)}
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                <input
                  id="senha"
                  type="password"
                  placeholder="Sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>

              {erro && <p className={styles.erroMensagem}>{erro}</p>}

              <button
                type="submit"
                className={styles.btnEntrar}
                disabled={loading}
              >
                {loading ? 'ENTRANDO...' : 'ENTRAR'}
              </button>
            </form>

            <div className={styles.formFooter}>
              <p>
                Não possui conta?{' '}
                <Link to="/cadastro" className={styles.linkDestaque}>
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.rodapeFlutuante}>
        <div className={styles.secaoEsquerda}>
          <button
            className={styles.btnSobreNosIsolado}
            onClick={() => setModalSobreNosAberto(true)}
          >
            Sobre nós
          </button>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Sangue Amigo. Todos os direitos reservados.
          </p>
        </div>

        <div className={styles.secaoDireita}>
          <span className={styles.sigaNos}>Link do nosso repositório:</span>
          <div className={styles.socialIcons}>
            <a
              href="https://github.com/ksobreira/hemoce-web"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      {modalEsqueciAberto && (
        <div
          className={styles.modalOverlay}
          onClick={() => setModalEsqueciAberto(false)}
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalFechar}
              onClick={() => setModalEsqueciAberto(false)}
            >
              &times;
            </button>

            <div className={styles.modalBodyVertical}>
              <h3>Recuperar Senha</h3>
              <p>
                Informe o e-mail associado à sua conta. Enviaremos as instruções
                para você redefinir sua senha.
              </p>

              <form onSubmit={handleRecuperarSenha} className={styles.modalForm}>
                <div className={styles.inputGroupModal}>
                  <label htmlFor="emailRecuperacao">E-MAIL DE CADASTRO</label>
                  <input
                    id="emailRecuperacao"
                    type="email"
                    placeholder="seu@email.com"
                    value={emailRecuperacao}
                    onChange={(e) => setEmailRecuperacao(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className={styles.btnEnviarRecuperacao}>
                  ENVIAR INSTRUÇÕES
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {modalSobreNosAberto && (
        <div
          className={styles.modalOverlay}
          onClick={() => setModalSobreNosAberto(false)}
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalFechar}
              onClick={() => setModalSobreNosAberto(false)}
            >
              &times;
            </button>

            <div className={styles.modalBody}>
              <div className={styles.modalTexto}>
                <h3>Sangue Amigo</h3>
                <p>
                  O Sangue Amigo é uma iniciativa dedicada a conectar doadores de
                  sangue voluntários a hemocentros e hospitais.
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