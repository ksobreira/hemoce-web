package com.github.sangueamigo.modules.agendamento.dto.request;

import com.github.sangueamigo.modules.agendamento.enums.StatusAgendamento;
import jakarta.validation.constraints.NotNull;

public record AtualizarStatusAgendamentoRequest(
        @NotNull StatusAgendamento status
) {
}
