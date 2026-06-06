package com.github.sangueamigo.modules.hemocentro.controller;

import com.github.sangueamigo.modules.hemocentro.dto.request.AtualizarHemocentroRequest;
import com.github.sangueamigo.modules.hemocentro.dto.request.AtualizarHorarioDisponivelRequest;
import com.github.sangueamigo.modules.hemocentro.dto.request.CriarHemocentroRequest;
import com.github.sangueamigo.modules.hemocentro.dto.request.CriarHorarioDisponivelRequest;
import com.github.sangueamigo.modules.hemocentro.dto.response.HemocentroResponse;
import com.github.sangueamigo.modules.hemocentro.dto.response.HorarioDisponivelResponse;
import com.github.sangueamigo.modules.hemocentro.service.HemocentroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/hemocentros")
@RequiredArgsConstructor
public class HemocentroController {

    private final HemocentroService hemocentroService;

    @GetMapping
    public ResponseEntity<List<HemocentroResponse>> listar() {
        return ResponseEntity.ok(hemocentroService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HemocentroResponse> buscarPorId(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(hemocentroService.buscarPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<HemocentroResponse> criar(
            @RequestBody @Valid CriarHemocentroRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(hemocentroService.criar(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<HemocentroResponse> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid AtualizarHemocentroRequest request
    ) {
        return ResponseEntity.ok(hemocentroService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> remover(
            @PathVariable Long id
    ) {
        hemocentroService.remover(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/horarios")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<HorarioDisponivelResponse> criarHorario(
            @PathVariable Long id,
            @RequestBody @Valid CriarHorarioDisponivelRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(hemocentroService.criarHorario(id, request));
    }

    @GetMapping("/{id}/horarios-periodo")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<HorarioDisponivelResponse>> listarHorarios(
            @PathVariable Long id,
            @RequestParam LocalDate inicio,
            @RequestParam LocalDate fim
    ) {
        return ResponseEntity.ok(hemocentroService.listarHorarios(id, inicio, fim));
    }

    @GetMapping("/{id}/horarios")
    public ResponseEntity<List<HorarioDisponivelResponse>> listarHorariosDisponiveis(
            @PathVariable Long id,
            @RequestParam LocalDate data
    ) {
        return ResponseEntity.ok(hemocentroService.listarHorariosDisponiveisPorData(id, data));
    }

    @PutMapping("/{hemocentroId}/horarios/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<HorarioDisponivelResponse> atualizarHorario(
            @PathVariable Long hemocentroId,
            @PathVariable Long id,
            @RequestBody @Valid AtualizarHorarioDisponivelRequest request
    ) {
        return ResponseEntity.ok(hemocentroService.atualizarHorario(hemocentroId, id, request));
    }

    @DeleteMapping("/{hemocentroId}/horarios/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> removerHorario(
            @PathVariable Long hemocentroId,
            @PathVariable Long id
    ) {
        hemocentroService.removerHorario(hemocentroId, id);
        return ResponseEntity.noContent().build();
    }
}
