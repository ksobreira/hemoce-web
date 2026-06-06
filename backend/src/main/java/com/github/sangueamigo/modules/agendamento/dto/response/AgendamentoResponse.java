package com.github.sangueamigo.modules.agendamento.dto.response;

import com.github.sangueamigo.modules.agendamento.entity.Agendamento;

import java.time.LocalDate;
import java.time.LocalTime;

public record AgendamentoResponse(
        Long id,
        LocalDate data,
        LocalTime horario,
        String status,
        String nomeHemocentro,
        String enderecoHemocentro
) {
    public static AgendamentoResponse from(Agendamento a) {
        return new AgendamentoResponse(
                a.getId(),
                a.getData(),
                a.getHorario(),
                a.getStatus().name(),
                a.getHemocentro().getNome(),
                a.getHemocentro().getEndereco()
        );
    }
}
