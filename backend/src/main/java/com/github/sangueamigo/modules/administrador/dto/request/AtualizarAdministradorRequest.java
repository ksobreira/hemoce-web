package com.github.sangueamigo.modules.administrador.dto.request;

import jakarta.validation.constraints.NotBlank;

public record AtualizarAdministradorRequest(
        @NotBlank String nome,
        String telefone,
        @NotBlank String cargo,
        Long hemocentroId
) {
}
