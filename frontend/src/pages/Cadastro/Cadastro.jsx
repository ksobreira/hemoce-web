import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Cadastro.module.css';
import { FaGithub } from 'react-icons/fa';
import logoSangueAmigo from '../../assets/LogoSangueAmigo.png';
import { authService } from '../../services/api';

function converterTipoSanguineo(tipo, fatorRhPositivo) {
  if (!tipo || tipo === 'Não Sei') {
    return '';
  }

  const sufixo = fatorRhPositivo ? 'POS' : 'NEG';

  const mapa = {
    A: `A_${sufixo}`,
    B: `B_${sufixo}`,
    AB: `AB_${sufixo}`,
    O: `O_${sufixo}`,
  };

  return mapa[tipo] || '';
}

function somenteNumeros(value) {
  return value.replace(/\D/g, '').slice(0, 11);
}

function telefoneValido(value) {
  const telefoneLimpo = somenteNumeros(value);
  return telefoneLimpo.length === 10 || telefoneLimpo.length === 11;
}

function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [sexo, setSexo] = useState('');
  const [tipoSanguineo, setTipoSanguineo] = useState('');
  const [fatorRhPositivo, setFatorRhPositivo] = useState(true);
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro('');

    if (senha !== confirmarSenha) {
      setErro('As senhas não conferem.');
      return;
    }

    const telefoneLimpo = somenteNumeros(telefone);

    if (!telefoneValido(telefoneLimpo)) {
      setErro('Informe um telefone válido com DDD.');
      return;
    }

    const tipoSanguineoBackend = converterTipoSanguineo(
      tipoSanguineo,
      fatorRhPositivo
    );

    if (!tipoSanguineoBackend) {
      setErro('Selecione um tipo sanguíneo válido.');
      return;
    }

    const dadosCadastro = {
      nome,
      cpf,
      email,
      senha,
      dataNascimento,
      tipoSanguineo: tipoSanguineoBackend,
      sexo,
      telefone: telefoneLimpo,
      cidade,
    };

    try {
      setLoading(true);

      await authService.cadastrarUsuario(dadosCadastro);

      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (error) {
      setErro(error.message || 'Não foi possível realizar o cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.metadeEsquerda}>
        <div className={styles.backgroundOverlay}></div>
      </div>

      <div className={styles.metadeDireita}>
        <div className={styles.cadastroCard}>
          <div className={styles.brandHeader}>
            <div className={styles.logoWrapper}>
              <img
                src={logoSangueAmigo}
                alt="Logo Sangue Amigo"
                className={styles.logoImg}
              />
            </div>
            <p className={styles.slogan}>Crie sua conta e comece a salvar vidas</p>
          </div>

          <div className={styles.formSection}>
            <form onSubmit={handleCadastro} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.inputGroupFull}>
                  <label htmlFor="nome">NOME COMPLETO</label>
                  <input
                    id="nome"
                    type="text"
                    placeholder="Seu nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.inputGroupFull}>
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
                  <label htmlFor="cpf">CPF</label>
                  <input
                    id="cpf"
                    type="text"
                    placeholder="00000000000"
                    value={cpf}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');

                      if (value.length <= 11) {
                        setCpf(value);
                      }
                    }}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="telefone">TELEFONE</label>
                  <input
                    id="telefone"
                    type="text"
                    inputMode="numeric"
                    maxLength={11}
                    pattern="[0-9]*"
                    placeholder="85999999999"
                    value={telefone}
                    onChange={(e) => setTelefone(somenteNumeros(e.target.value))}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="cidade">CIDADE</label>
                  <input
                    id="cidade"
                    type="text"
                    placeholder="Sua cidade"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="dataNascimento">DATA DE NASCIMENTO</label>
                  <input
                    id="dataNascimento"
                    type="date"
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="sexo">SEXO</label>
                  <select
                    id="sexo"
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value)}
                    required
                  >
                    <option value="" disabled hidden>
                      Selecione
                    </option>
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMININO">Feminino</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="tipoSanguineo">TIPO SANGUÍNEO</label>
                  <select
                    id="tipoSanguineo"
                    value={tipoSanguineo}
                    onChange={(e) => setTipoSanguineo(e.target.value)}
                    required
                  >
                    <option value="" disabled hidden>
                      Selecione
                    </option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>

                <div className={styles.inputGroupRh}>
                  <label>FATOR RH</label>
                  <div className={styles.switchContainer}>
                    <span
                      className={`${styles.labelRh} ${
                        !fatorRhPositivo ? styles.rhAtivo : ''
                      }`}
                    >
                      NEGATIVO (-)
                    </span>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={fatorRhPositivo}
                        onChange={(e) => setFatorRhPositivo(e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                    <span
                      className={`${styles.labelRh} ${
                        fatorRhPositivo ? styles.rhAtivo : ''
                      }`}
                    >
                      POSITIVO (+)
                    </span>
                  </div>
                </div>

                <div className={styles.inputGroupFull}>
                  <label htmlFor="senha">SENHA</label>
                  <input
                    id="senha"
                    type="password"
                    placeholder="Crie uma senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.inputGroupFull}>
                  <label htmlFor="confirmarSenha">CONFIRMAR SENHA</label>
                  <input
                    id="confirmarSenha"
                    type="password"
                    placeholder="Repita a senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                  />
                </div>
              </div>

              {erro && <p className={styles.erroMensagem}>{erro}</p>}

              <button
                type="submit"
                className={styles.btnCadastrar}
                disabled={loading}
              >
                {loading ? 'CADASTRANDO...' : 'CADASTRAR'}
              </button>
            </form>

            <div className={styles.formFooter}>
              <p>
                Já possui uma conta?{' '}
                <Link to="/login" className={styles.linkDestaque}>
                  Faça Login
                </Link>
              </p>
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
    </div>
  );
}

export default Cadastro;
