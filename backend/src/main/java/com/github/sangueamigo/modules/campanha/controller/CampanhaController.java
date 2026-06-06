package com.github.sangueamigo.modules.campanha.controller;

import com.github.sangueamigo.modules.campanha.dto.request.AtualizarCampanhaRequest;
import com.github.sangueamigo.modules.campanha.dto.request.CriarCampanhaRequest;
import com.github.sangueamigo.modules.campanha.dto.response.CampanhaResponse;
import com.github.sangueamigo.modules.campanha.service.CampanhaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/campanhas")
@RequiredArgsConstructor
public class CampanhaController {

    private final CampanhaService campanhaService;

    @GetMapping
    public ResponseEntity<List<CampanhaResponse>> listarAtivas() {
        return ResponseEntity.ok(campanhaService.listarAtivas());
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<CampanhaResponse>> listarTodas() {
        return ResponseEntity.ok(campanhaService.listarTodas());
    }

    @GetMapping("/hemocentro/{hemocentroId}")
    public ResponseEntity<List<CampanhaResponse>> listarPorHemocentro(
            @PathVariable Long hemocentroId
    ) {
        return ResponseEntity.ok(campanhaService.listarPorHemocentro(hemocentroId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampanhaResponse> buscarPorId(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(campanhaService.buscarPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<CampanhaResponse> criar(
            @RequestBody @Valid CriarCampanhaRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(campanhaService.criar(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<CampanhaResponse> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid AtualizarCampanhaRequest request
    ) {
        return ResponseEntity.ok(campanhaService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> remover(
            @PathVariable Long id
    ) {
        campanhaService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
