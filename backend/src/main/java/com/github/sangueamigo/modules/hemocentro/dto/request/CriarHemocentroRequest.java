package com.github.sangueamigo.modules.hemocentro.dto.request;

import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.br.CNPJ;

public record CriarHemocentroRequest(
        @NotBlank String nome,
        @NotBlank @CNPJ String cnpj,
        @NotBlank String telefone,
        @NotBlank String endereco,
        String cidade,
        String estado
) {
}
