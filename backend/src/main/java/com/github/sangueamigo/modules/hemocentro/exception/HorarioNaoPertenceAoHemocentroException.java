package com.github.sangueamigo.modules.hemocentro.exception;

public class HorarioNaoPertenceAoHemocentroException extends RuntimeException {
    public HorarioNaoPertenceAoHemocentroException() {
        super("Horario nao pertence a unidade informada.");
    }
}
