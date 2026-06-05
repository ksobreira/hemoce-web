package com.github.sangueamigo.modules.doacao.controller;

import com.github.sangueamigo.modules.conta.entity.Conta;
import com.github.sangueamigo.modules.doacao.dto.DoacaoResponse;
import com.github.sangueamigo.modules.doacao.service.DoacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/doacoes")
@RequiredArgsConstructor
public class DoacaoController {

    private final DoacaoService doacaoService;

    @GetMapping("/historico")
    @PreAuthorize("hasAuthority('ROLE_USUARIO')")
    public ResponseEntity<List<DoacaoResponse>> listarHistoricoUsuario(
            @AuthenticationPrincipal Conta conta
    ) {
        return ResponseEntity.ok(doacaoService.listarHistoricoDoUsuario(conta.getId()));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<DoacaoResponse>> listarHistoricoHemocentro(
            @RequestParam Long hemocentroId
    ) {
        return ResponseEntity.ok(doacaoService.listarHistoricoDoHemocentro(hemocentroId));
    }
}
