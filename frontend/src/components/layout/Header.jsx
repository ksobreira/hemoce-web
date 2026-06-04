import React from "react";
import { Link, useLocation } from "react-router-dom";
import logoSangueAmigo from "../../assets/logo-sangue-amigo.jpeg";
import styles from "./Header.module.css";

function Header() {
  const location = useLocation();

  const links = [
    { to: "/home", label: "INÍCIO" },
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
        {
          to: "/agendamentos/1",
          title: "Próximo agendamento",
          description: "Hemoce Fortaleza às 14:00",
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
        {
          to: "/campanhas/1",
          title: "Estoque baixo O-",
          description: "Urgência alta em Fortaleza",
        },
        {
          to: "/campanhas/2",
          title: "Semana Solidária",
          description: "Ação especial em Sobral",
        },
      ],
    },
    { to: "/orientacoes", label: "ORIENTAÇÕES" },
    { to: "/assistente", label: "ASSISTENTE IA" },
  ];

  function isActive(path) {
    if (path === "/home") {
      return location.pathname === "/home" ? styles.active : "";
    }

    return location.pathname.startsWith(path) ? styles.active : "";
  }

  return (
    <header className={styles.mainHeader}>
      <div className={styles.headerContent}>
        <Link to="/home" className={styles.logoArea}>
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

        <Link to="/perfil" className={styles.profileLink}>
          <span className={styles.userName}>JOÃO SILVA</span>
          <span className={styles.userAvatar}>JS</span>
        </Link>
      </div>
    </header>
  );
}

export default Header;