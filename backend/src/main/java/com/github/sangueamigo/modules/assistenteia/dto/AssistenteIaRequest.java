package com.github.sangueamigo.modules.assistenteia.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AssistenteIaRequest(
        @NotBlank
        @Size(max = 1000)
        String pergunta
) {
}
