package com.github.sangueamigo.modules.assistenteia.dto;

public record AssistenteIaResponse(
        String resposta,
        String aviso,
        boolean respostaGeradaPorIa
) {
}
