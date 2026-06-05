package com.github.sangueamigo.modules.assistenteia.controller;

import com.github.sangueamigo.modules.assistenteia.dto.AssistenteIaRequest;
import com.github.sangueamigo.modules.assistenteia.dto.AssistenteIaResponse;
import com.github.sangueamigo.modules.assistenteia.service.AssistenteIaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/assistente-ia")
@RequiredArgsConstructor
public class AssistenteIaController {

    private final AssistenteIaService assistenteIaService;

    @PostMapping
    public ResponseEntity<AssistenteIaResponse> perguntar(
            @RequestBody @Valid AssistenteIaRequest request
    ) {
        return ResponseEntity.ok(assistenteIaService.responder(request.pergunta()));
    }

    @GetMapping("/status")
    public ResponseEntity<String> status() {
        return ResponseEntity.ok("Assistente IA disponivel");
    }
}
