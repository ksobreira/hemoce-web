package com.github.sangueamigo.modules.administrador.controller;

import com.github.sangueamigo.modules.administrador.dto.request.AtualizarAdministradorRequest;
import com.github.sangueamigo.modules.administrador.dto.response.AdministradorResponse;
import com.github.sangueamigo.modules.administrador.service.AdministradorService;
import com.github.sangueamigo.modules.conta.entity.Conta;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/administradores")
@RequiredArgsConstructor
public class AdministradorController {

    private final AdministradorService administradorService;

    @GetMapping("/perfil")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<AdministradorResponse> buscarPerfil(
            @AuthenticationPrincipal Conta conta
    ) {
        return ResponseEntity.ok(administradorService.buscarPerfil(conta.getId()));
    }

    @PutMapping("/perfil")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<AdministradorResponse> atualizarPerfil(
            @AuthenticationPrincipal Conta conta,
            @RequestBody @Valid AtualizarAdministradorRequest request
    ) {
        return ResponseEntity.ok(administradorService.atualizarPerfil(conta.getId(), request));
    }
}
