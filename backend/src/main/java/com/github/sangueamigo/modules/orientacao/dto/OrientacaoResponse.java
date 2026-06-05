package com.github.sangueamigo.modules.orientacao.dto;

import java.util.List;

public record OrientacaoResponse(
        String titulo,
        String descricao,
        List<String> itens
) {
}
