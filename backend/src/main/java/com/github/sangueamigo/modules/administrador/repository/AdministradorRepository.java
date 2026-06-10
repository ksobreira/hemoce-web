package com.github.sangueamigo.modules.administrador.repository;

import com.github.sangueamigo.modules.administrador.entity.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdministradorRepository extends JpaRepository<Administrador, Long> {
    Optional<Administrador> findByContaId(Long contaId);

    boolean existsByContaId(Long contaId);
}
