package com.github.sangueamigo.modules.agendamento.controller;

import com.github.sangueamigo.modules.agendamento.dto.request.CriarAgendamentoRequest;
import com.github.sangueamigo.modules.agendamento.dto.request.ValidarQrCodeRequest;
import com.github.sangueamigo.modules.agendamento.dto.response.AgendamentoResponse;
import com.github.sangueamigo.modules.agendamento.dto.response.ValidacaoQrCodeResponse;
import com.github.sangueamigo.modules.agendamento.service.AgendamentoService;
import com.github.sangueamigo.modules.conta.entity.Conta;
import com.github.sangueamigo.modules.qrcode.QrCodeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/agendamentos")
@RequiredArgsConstructor
public class AgendamentoController {

    private final AgendamentoService agendamentoService;
    private final QrCodeService qrCodeService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_USUARIO')")
    public ResponseEntity<AgendamentoResponse> criar(
            @AuthenticationPrincipal Conta conta,
            @RequestBody @Valid CriarAgendamentoRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(agendamentoService.criar(conta.getId(), request));
    }

    @PatchMapping("/{id}/confirmar")
    @PreAuthorize("hasAuthority('ROLE_USUARIO')")
    public ResponseEntity<AgendamentoResponse> confirmar(
            @AuthenticationPrincipal Conta conta,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(agendamentoService.confirmar(id, conta.getId()));
    }

    @PatchMapping("/{id}/cancelar")
    @PreAuthorize("hasAuthority('ROLE_USUARIO')")
    public ResponseEntity<Void> cancelar(
            @AuthenticationPrincipal Conta conta,
            @PathVariable Long id
    ) {
        agendamentoService.cancelar(id, conta.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_USUARIO')")
    public ResponseEntity<List<AgendamentoResponse>> listarTodos(
            @AuthenticationPrincipal Conta conta
    ) {
        return ResponseEntity.ok(agendamentoService.listarTodosDoUsuario(conta.getId()));
    }

    @GetMapping("/ativos")
    @PreAuthorize("hasAuthority('ROLE_USUARIO')")
    public ResponseEntity<List<AgendamentoResponse>> listarAtivos(
            @AuthenticationPrincipal Conta conta
    ) {
        return ResponseEntity.ok(agendamentoService.listarAtivosDoUsuario(conta.getId()));
    }

    @GetMapping("/{id}/qrcode")
    @PreAuthorize("hasAuthority('ROLE_USUARIO')")
    public ResponseEntity<String> obterQrCode(
            @AuthenticationPrincipal Conta conta,
            @PathVariable Long id
    ) {
        String token = agendamentoService.buscarQrCodeToken(id, conta.getId());
        return ResponseEntity.ok(qrCodeService.gerarQrCodeBase64(token));
    }

    @PostMapping("/validar-qrcode")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ValidacaoQrCodeResponse> validarQrCode(
            @RequestBody @Valid ValidarQrCodeRequest request
    ) {
        return ResponseEntity.ok(agendamentoService.validarQrCode(request));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<AgendamentoResponse>> listarPorHemocentro(
            @RequestParam Long hemocentroId,
            @RequestParam LocalDate data
    ) {
        return ResponseEntity.ok(agendamentoService.listarPorHemocentro(hemocentroId, data));
    }
}
