import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoSangueAmigo from "../../assets/logo-sangue-amigo.jpeg";
import { useAuth } from "../../hooks/useAuth";
import styles from "./Header.module.css";

function getInitials(name, fallback) {
  if (!name) return fallback;

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  return parts[0]?.slice(0, 2).toUpperCase() || fallback;
}

function getFirstName(name, fallback) {
  return name?.trim().split(/\s+/)[0] || fallback;
}

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isAdmin, userName } = useAuth();

  const inicioPath = isAdmin ? "/admin" : "/home";
  const displayName = isAdmin
    ? getFirstName(userName, "Administrador")
    : getFirstName(userName, "Usuário");
  const avatarInitials = isAdmin ? "AD" : getInitials(displayName, "US");

  const userLinks = [
    { to: inicioPath, label: "INÍCIO" },
    {
      to: "/agendamentos",
      label: "AGENDAMENTOS",
      submenu: [
        {
          to: "/agendamentos",
          title: "Meus agendamentos",
          description: "Ver histórico e próximos horários",
        },
        {
          to: "/agendamentos/novo",
          title: "Novo agendamento",
          description: "Escolher unidade, data e horário",
        },
      ],
    },
    {
      to: "/campanhas",
      label: "CAMPANHAS",
      submenu: [
        {
          to: "/campanhas",
          title: "Ver campanhas",
          description: "Campanhas e alertas ativos",
        },
      ],
    },
    { to: "/orientacoes", label: "ORIENTAÇÕES" },
    { to: "/assistente", label: "ASSISTENTE IA" },
  ];

  const adminLinks = [
    { to: "/admin", label: "INÍCIO" },
    {
      to: "/admin/campanhas",
      label: "CAMPANHAS",
      submenu: [
        {
          to: "/admin/campanhas",
          title: "Gerenciar campanhas",
          description: "Listar campanhas cadastradas",
        },
        {
          to: "/admin/campanhas/nova",
          title: "Nova campanha",
          description: "Criar campanha ou alerta",
        },
      ],
    },
    {
      to: "/admin/agendamentos",
      label: "AGENDAMENTOS",
      submenu: [
        {
          to: "/admin/agendamentos",
          title: "Gerenciar agendamentos",
          description: "Confirmar, concluir ou cancelar horários",
        },
      ],
    },
    {
      to: "/campanhas",
      label: "VISÃO PÚBLICA",
      submenu: [
        {
          to: "/campanhas",
          title: "Campanhas do usuário",
          description: "Ver como campanhas aparecem para doadores",
        },
      ],
    },
    { to: "/orientacoes", label: "ORIENTAÇÕES" },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  function isActive(path) {
    if (path === "/home" || path === "/admin") {
      return location.pathname === path ? styles.active : "";
    }

    return location.pathname.startsWith(path) ? styles.active : "";
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className={styles.mainHeader}>
      <div className={styles.headerContent}>
        <Link to={inicioPath} className={styles.logoArea}>
          <img
            src={logoSangueAmigo}
            alt="Logo Sangue Amigo"
            className={styles.logoImage}
          />
        </Link>

        <nav className={styles.navMenu}>
          {links.map((link) => (
            <div key={link.to} className={styles.navItem}>
              <Link
                to={link.to}
                className={`${styles.navLink} ${isActive(link.to)}`}
              >
                {link.label}
              </Link>

              {link.submenu && (
                <div className={styles.submenu}>
                  {link.submenu.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={styles.submenuItem}
                    >
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className={styles.profileArea}>
          <Link to="/perfil" className={styles.profileLink}>
            <span className={styles.userName}>{displayName}</span>
            <span className={styles.userAvatar}>{avatarInitials}</span>
          </Link>

          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
