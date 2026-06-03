import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Header.module.css";

function Header() {
  const location = useLocation();

  const links = [
    { to: "/home", label: "INÍCIO" },
    { to: "/agendamentos", label: "AGENDAMENTOS" },
    { to: "/campanhas", label: "CAMPANHAS" },
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
          <span className={styles.logoIcon}>+</span>
          <span className={styles.logoText}>SANGUE AMIGO</span>
        </Link>

        <nav className={styles.navMenu}>
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`${styles.navLink} ${isActive(link.to)}`}
            >
              {link.label}
            </Link>
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